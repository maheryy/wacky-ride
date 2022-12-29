/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MessageModel } from "../../../../models/message";
import { createMessageWithinRoom } from "../../../../services/message.service";
import {
  getRooms,
  joinRoom,
  leaveRoom,
} from "../../../../services/room.service";
import { IFullMessage } from "../../../../types/message";
import { IRoomEmitEvents, TRoomIO, TRoomSocket } from "../../../@types/main";
import { withErrorHandling } from "../../../helpers/withErrorHandling";

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

    const room = await joinRoom(roomId, socket.data.user.id);

    socket.join(`R-${roomId}`);

    socket.emit("room:joined", { data: { room } });
  }

  async function onLeave(roomId: number) {
    console.log("[socket.io]: room:leave", roomId);

    await leaveRoom(roomId, socket.data.user.id);

    socket.leave(`R-${roomId}`);

    socket.emit("room:left", { data: { roomId } });
  }

  async function onRooms() {
    const rooms = await getRooms();

    socket.emit("rooms", { data: { rooms } });
  }

  socket.on("room:message:send", handle(onMessage, "room:message:received"));
  socket.on("room:join", handle(onJoin, "room:joined"));
  socket.on("room:leave", handle(onLeave, "room:left"));
  socket.on("rooms", handle(onRooms, "rooms"));
}

export default registerRoomHandlers;
