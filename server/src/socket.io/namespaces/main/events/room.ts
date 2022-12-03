/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MessageModel } from "../../../../models/message";
import { RoomModel } from "../../../../models/room";
import { createMessageWithinRoom } from "../../../../services/message.service";
import { getRoomByIdWithUsersAndMessages } from "../../../../services/room.service";
import { IFullMessage } from "../../../../types/message";
import { IUser } from "../../../../types/user";
import { TRoomIO, TRoomSocket } from "../../../@types";

const currentUser: IUser = {
  id: 1,
  username: "admin",
  email: "admin@wacky.com",
  password: "password",
  status: "online",
  isAdmin: true,
};

function registerRoomHandlers(io: TRoomIO, socket: TRoomSocket) {
  async function onMessage(message: Omit<IFullMessage, "id">) {
    console.log("[socket.io]: room:message:send");

    const newMessage = await createMessageWithinRoom(
      message.content,
      message.author.id,
      message.room!.id
    );

    io.to(`R-${message.room!.id}`).emit("room:message:received", {
      ...(newMessage as MessageModel).toJSON(),
      author: message.author,
    });
  }

  async function onJoin(roomId: number) {
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
    } catch (e: unknown) {
      console.error(e);
    }
  }

  function onLeave(roomId: number) {
    console.log("[socket.io]: room:leave", roomId);

    socket.leave(`R-${roomId}`);
  }

  socket.on("room:message:send", onMessage);
  socket.on("room:join", onJoin);
  socket.on("room:leave", onLeave);
}

export default registerRoomHandlers;
