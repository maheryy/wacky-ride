import { Server } from "socket.io";
import { MessageModel } from "../models/message";
import { RoomModel } from "../models/room";

import { createMessageWithinRoom } from "../services/message.service";
import { getRoomByIdWithUsersAndMessages } from "../services/room.service";
import { IFullMessage } from "../types/message";
import {
  EmitEvents,
  InterServerEvents,
  ListenEvents,
  Socket,
  SocketData,
} from "../types/socket.io";
import { IUser } from "../types/user";

const currentUser: IUser = {
  id: 1,
  username: "admin",
  email: "admin@wacky.com",
  password: "password",
  status: 1,
  isAdmin: true,
};

const getRoomHandlers = (
  io: Server<ListenEvents, EmitEvents, InterServerEvents, SocketData>,
  socket: Socket
) => {
  const onRoomMessageSend = async (message: Omit<IFullMessage, "id">) => {
    console.log("[socket.io]: room:message:send");

    const newMessage = await createMessageWithinRoom(
      message.content,
      message.user.id,
      message.room!.id
    );

    io.to(`R-${message.room!.id}`).emit("room:message:received", {
      ...(newMessage as MessageModel).toJSON(),
      user: message.user,
    });
  };

  const onRoomJoin = async (roomId: number) => {
    console.log("[socket.io]: room:join", roomId);
    try {
      const room = await getRoomByIdWithUsersAndMessages(roomId);

      if (!room) {
        throw new Error("Room not found");
      }

      if (!room.users!.find((user) => user.id === currentUser.id)) {
        await (room as RoomModel).addUser(currentUser.id);
      }

      socket.join(`R-${roomId}`);
      socket.emit("room:load", room, room.messages as IFullMessage[]);
    } catch (e: any) {
      console.error(e.message);
    }
  };

  const onRoomLeave = (roomId: number) => {
    console.log("[socket.io]: room:leave", roomId);
    socket.leave(`R-${roomId}`);
  };

  return {
    onRoomJoin,
    onRoomLeave,
    onRoomMessageSend,
  };
};

export default getRoomHandlers;
