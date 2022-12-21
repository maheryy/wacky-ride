/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createRoom } from "../../../../services/room.service";
import { IRoomEmitEvents, TRoomIO, TRoomSocket } from "../../../@types/admin";
import { withErrorHandling } from "../../../helpers/withErrorHandling";

function registerRoomHandlers(io: TRoomIO, socket: TRoomSocket) {
  const handle = withErrorHandling<IRoomEmitEvents>(socket);

  async function onCreate(roomName: string) {
    const room = await createRoom(roomName);

    socket.emit("room:created", { data: { room } });
  }

  socket.on("room:create", handle(onCreate, "room:created"));
}

export default registerRoomHandlers;
