import { Transaction } from "sequelize";
import sequelize, { db } from "../database/sequelize";
import { WackyRideError } from "../socket.io/errors/WackyRideError";
import {
  IRoom,
  TRoomUpdateAttributes,
  TRoomWithUsers,
  TRoomWithUsersAndMessages,
} from "../types/room";
import { IUser } from "../types/user";

const { Message, Room, User } = db;

export function createRoom(roomName: string) {
  return Room.create({ name: roomName });
}

export const getRoomById = async (roomId: number): Promise<IRoom | null> => {
  return Room.findByPk(roomId);
};

export function getRooms() {
  return Room.findAll();
}

export function getRoomWithUsers(
  roomId: IRoom["id"],
  transaction?: Transaction
) {
  return Room.findByPk(roomId, {
    include: [{ model: User, as: "users" }],
    transaction,
  }) as Promise<TRoomWithUsers | null>;
}

export async function joinRoom(roomId: IRoom["id"], userId: IUser["id"]) {
  const transaction = await sequelize.transaction();

  try {
    const room = await getRoomWithUsersAndMessages(roomId, transaction);

    if (!room) {
      throw new WackyRideError("The room does not exist");
    }

    const isUserInRoom = room.users.some((user) => user.id === userId);

    if (isUserInRoom) {
      throw new WackyRideError("You are already in this room");
    }

    const isRoomFull = room.users.length >= room.limit;

    if (isRoomFull) {
      throw new WackyRideError("The room is full");
    }

    await room.addUser(userId, { transaction });

    await transaction.commit();

    return room;
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
}

export async function leaveRoom(roomId: IRoom["id"], userId: IUser["id"]) {
  const transaction = await sequelize.transaction();

  try {
    const room = await getRoomWithUsers(roomId, transaction);

    if (!room) {
      throw new WackyRideError("The room does not exist");
    }

    const isUserInRoom = room.users.some((user) => user.id === userId);

    if (!isUserInRoom) {
      throw new WackyRideError("You are not in this room");
    }

    await room.removeUser(userId, { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
}

export function getRoomWithUsersAndMessages(
  roomId: IRoom["id"],
  transaction?: Transaction
) {
  return Room.findByPk(roomId, {
    include: [
      {
        model: User,
        as: "users",
      },
      {
        model: Message,
        as: "messages",
        order: [["createdAt", "DESC"]],
        include: [{ model: User, as: "author" }],
      },
    ],
    transaction,
  }) as Promise<TRoomWithUsersAndMessages | null>;
}

export function updateRoom(roomId: IRoom["id"], fields: TRoomUpdateAttributes) {
  return Room.update(fields, { where: { id: roomId } });
}

export function deleteRoom(roomId: IRoom["id"]) {
  return Room.destroy({ where: { id: roomId } });
}

export async function restoreRoom(roomId: IRoom["id"]) {
  const transaction = await sequelize.transaction();

  try {
    const room = await Room.findByPk(roomId, { transaction, paranoid: false });

    if (!room) {
      throw new WackyRideError("The room does not exist");
    }

    if (!room.deletedAt) {
      throw new WackyRideError("The room is not deleted");
    }

    await room.restore({ transaction });

    await transaction.commit();

    return room;
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
}
