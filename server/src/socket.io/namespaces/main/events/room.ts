import { createMessage } from "../../../../services/message.service";
import {
  getRooms,
  joinRoom,
  leaveRoom,
} from "../../../../services/room.service";
import { IMessage } from "../../../../types/message";
import { IRoom } from "../../../../types/room";
import { IRoomEmitEvents, TRoomIO, TRoomSocket } from "../../../@types/main";
import { WackyRideError } from "../../../errors/WackyRideError";
import { withErrorHandling } from "../../../helpers/withErrorHandling";

function registerRoomHandlers(io: TRoomIO, socket: TRoomSocket) {
  const handle = withErrorHandling<IRoomEmitEvents>(socket);

  async function onMessage(roomId: IRoom["id"], content: IMessage["content"]) {
    console.log("[socket.io]: room:message:send");

    const isUserInRoom = socket.rooms.has(`R-${roomId}`);

    if (!isUserInRoom) {
      throw new WackyRideError("You are not in this room");
    }

    const message = await createMessage({
      roomId,
      authorId: socket.data.user.id,
      content,
    });

    io.to(`R-${roomId}`).emit("room:message:received", {
      data: { message },
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
