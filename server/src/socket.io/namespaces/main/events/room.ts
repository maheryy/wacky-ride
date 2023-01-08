import { createMessage } from "../../../../services/message.service";
import {
  getRooms,
  getRoomWithMessages,
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

    const isUserInRoom = socket.rooms.has(`room:${roomId}`);

    if (!isUserInRoom) {
      throw new WackyRideError("You are not in this room");
    }

    const message = await createMessage({
      roomId,
      authorId: socket.data.user.id,
      content,
    });

    io.to(`room:${roomId}`).emit("room:message:received", {
      data: { message },
    });
  }

  async function onJoin(roomId: number) {
    console.log("[socket.io]: room:join", roomId);

    const room = await getRoomWithMessages(roomId);

    if (!room) {
      throw new WackyRideError("The room does not exist");
    }

    const sockets = await io.in(`room:${room.id}`).fetchSockets();

    const uniqueUserIds = new Set(sockets.map(({ data }) => data.user.id));

    const isUserInRoom = uniqueUserIds.has(socket.data.user.id);

    const isRoomFull = uniqueUserIds.size >= room.limit;

    if (!isUserInRoom && isRoomFull) {
      throw new WackyRideError("The room is full");
    }

    socket.join(`room:${roomId}`);

    socket.emit("room:joined", { data: { room } });
  }

  async function onLeave(roomId: number) {
    console.log("[socket.io]: room:leave", roomId);

    socket.leave(`room:${roomId}`);

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

