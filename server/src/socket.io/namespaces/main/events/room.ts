/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MessageModel } from "../../../../models/message";
import { RoomModel } from "../../../../models/room";
import { createMessageWithinRoom } from "../../../../services/message.service";
import {
  getRoomByIdWithUsersAndMessages,
  getRooms,
} from "../../../../services/room.service";
import { IFullMessage } from "../../../../types/message";
import { IUser } from "../../../../types/user";
import { IRoomEmitEvents, TRoomIO, TRoomSocket } from "../../../@types/main";
import { WackyRideError } from "../../../errors/WackyRideError";
import { withErrorHandling } from "../../../helpers/withErrorHandling";

const currentUser: IUser = {
  id: 1,
  username: "admin",
  email: "admin@wacky.com",
  password: "password",
  status: "online",
  isAdmin: true,
};

function registerRoomHandlers(io: TRoomIO, socket: TRoomSocket) {
  const handle = withErrorHandling<IRoomEmitEvents>(socket);

  async function onMessage(message: Omit<IFullMessage, "id">) {
    console.log("[socket.io]: room:message:send");

    const newMessage = await createMessageWithinRoom(
      message.content,
      message.author.id,
      message.room!.id
    );

    io.to(`R-${message.room!.id}`).emit("room:message:received", {
      data: {
        message: {
          ...(newMessage as MessageModel).toJSON(),
          author: message.author,
        },
      },
    });
  }

  async function onJoin(roomId: number) {
    console.log("[socket.io]: room:join", roomId);

    const room = await getRoomByIdWithUsersAndMessages(roomId);

    if (!room) {
      throw new WackyRideError("Room not found");
    }

    if (!room.users!.find((user) => user.id === currentUser.id)) {
      await (room as RoomModel).addUser(currentUser.id);
    }

    socket.join(`R-${roomId}`);

    socket.emit("room:load", {
      data: {
        room,
        messages: room.messages as IFullMessage[],
      },
    });
  }

  function onLeave(roomId: number) {
    console.log("[socket.io]: room:leave", roomId);

    socket.leave(`R-${roomId}`);
  }

  async function onRooms() {
    const rooms = await getRooms();

    socket.emit("rooms", { data: { rooms } });
  }

  socket.on("room:message:send", handle(onMessage, "room:message:received"));
  socket.on("room:join", handle(onJoin, "room:load"));
  socket.on("room:leave", onLeave);
  socket.on("rooms", handle(onRooms, "rooms"));
}

export default registerRoomHandlers;
