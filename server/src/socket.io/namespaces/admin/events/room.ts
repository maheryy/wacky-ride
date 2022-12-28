/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  createRoom,
  deleteRoom,
  updateRoom,
} from "../../../../services/room.service";
import { IRoom, TRoomUpdateAttributes } from "../../../../types/room";
import { IRoomEmitEvents, TRoomIO, TRoomSocket } from "../../../@types/admin";
import { withErrorHandling } from "../../../helpers/withErrorHandling";

function registerRoomHandlers(io: TRoomIO, socket: TRoomSocket) {
  const handle = withErrorHandling<IRoomEmitEvents>(socket);

  async function onCreate(roomName: string) {
    const room = await createRoom(roomName);

    socket.emit("room:created", { data: { room } });
  }

  /**
   * Updates the the room with the given `id`.
   *
   * Emits `room:updated` to the client and the main namespace
   */
  async function onUpdate(
    id: IRoom["id"],
    { limit, name }: TRoomUpdateAttributes
  ) {
    const fields = { limit, name };

    await updateRoom(id, fields);

    const data = { id, fields };

    socket.emit("room:updated", { data });

    io.of("/").emit("room:updated", { data });
  }

  /**
   * Deletes the room with the given `id`.
   *
   * Emits `room:deleted` to the client and the main namespace
   */
  async function onDelete(id: IRoom["id"]) {
    await deleteRoom(id);

    socket.emit("room:deleted", { data: { id } });

    io.of("/").emit("room:deleted", { data: { id } });
  }

  socket.on("room:create", handle(onCreate, "room:created"));
  socket.on("room:update", handle(onUpdate, "room:updated"));
  socket.on("room:delete", handle(onDelete, "room:deleted"));
}

export default registerRoomHandlers;
