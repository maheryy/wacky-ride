import { Transaction } from "sequelize";
import sequelize, { db } from "../database/sequelize";
import { WackyRideError } from "../socket.io/errors/WackyRideError";
import {
  IRoom,
  TRoomCreate,
  TRoomUpdate,
  TRoomWithMessages,
  TRoomWithUsers,
  TRoomWithUsersAndMessages,
} from "../types/room";

const { Room } = db;

export function createRoom(room: TRoomCreate) {
  return Room.create(room);
}

export function getRoomById(roomId: number, transaction?: Transaction) {
  return Room.findByPk(roomId, { transaction });
}

export function getRooms() {
  return Room.findAll();
}

export function getRoomWithUsers(
  roomId: IRoom["id"],
  transaction?: Transaction
) {
  return Room.scope("withUsers").findByPk(roomId, {
    transaction,
  }) as Promise<TRoomWithUsers | null>;
}

export function getRoomWithMessages(roomId: IRoom["id"]) {
  return Room.scope("withMessages").findByPk(
    roomId
  ) as Promise<TRoomWithMessages | null>;
}

export function getRoomWithUsersAndMessages(
  roomId: IRoom["id"],
  transaction?: Transaction
) {
  return Room.scope(["withUsers", "withMessages"]).findByPk(roomId, {
    transaction,
  }) as Promise<TRoomWithUsersAndMessages | null>;
}

export function updateRoom(room: TRoomUpdate) {
  const { id, ...fields } = room;

  return Room.update(fields, { where: { id } });
}

export function deleteRoom(roomId: IRoom["id"]) {
  return Room.destroy({ where: { id: roomId } });
}

export async function restoreRoom(roomId: IRoom["id"]) {
  const transaction = await sequelize.transaction();

  try {
    const room = await Room.scope("withDeletedAt").findByPk(roomId, {
      transaction,
      paranoid: false,
    });

    if (!room) {
      throw new WackyRideError("Ce salon n'existe pas");
    }

    if (!room.deletedAt) {
      throw new WackyRideError("Ce salon n'était pas supprimé");
    }

    await room.restore({ transaction });

    await transaction.commit();

    return room;
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
}

