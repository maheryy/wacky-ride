/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createRoom, updateRoomName } from "../../../../services/room.service";
import { IRoom } from "../../../../types/room";
import { IRoomEmitEvents, TRoomIO, TRoomSocket } from "../../../@types/admin";
import { withErrorHandling } from "../../../helpers/withErrorHandling";

function registerRoomHandlers(io: TRoomIO, socket: TRoomSocket) {
  const handle = withErrorHandling<IRoomEmitEvents>(socket);

  async function onCreate(roomName: string) {
    const room = await createRoom(roomName);

    socket.emit("room:created", { data: { room } });
  }

  /**
   * Updates the name of the room with the given `id`.
   *
   * Emits `room:name:updated` to the client and the main namespace
   */
  async function onRoomNameUpdate(id: IRoom["id"], name: IRoom["name"]) {
    await updateRoomName(id, name);

    const data = { id, name };

    socket.emit("room:name:updated", { data });

    io.of("/").emit("room:name:updated", { data });
  }

  socket.on("room:create", handle(onCreate, "room:created"));
  socket.on("room:name:update", handle(onRoomNameUpdate, "room:name:updated"));
}

export default registerRoomHandlers;
