/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  createRoom,
  deleteRoom,
  restoreRoom,
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

  /**
   * Restores the room with the given `id`.
   *
   * Emits `room:restored` to the client and the main namespace
   */
  async function onRestore(id: IRoom["id"]) {
    const room = await restoreRoom(id);

    socket.emit("room:restored", { data: { room } });

    io.of("/").emit("room:restored", { data: { room } });
  }

  socket.on("room:create", handle(onCreate, "room:created"));
  socket.on("room:update", handle(onUpdate, "room:updated"));
  socket.on("room:delete", handle(onDelete, "room:deleted"));
  socket.on("room:restore", handle(onRestore, "room:restored"));
}

export default registerRoomHandlers;
