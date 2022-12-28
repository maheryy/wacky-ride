import { db } from "../database/sequelize";
import { IFullRoom, IRoom, TRoomUpdateAttributes } from "../types/room";

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

export const getRoomByIdWithUsersAndMessages = async (
  roomId: number
): Promise<IFullRoom | null> => {
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
        include: [
          {
            model: User,
            as: "author",
          },
        ],
      },
    ],
  }) as Promise<IFullRoom | null>;
};

export function updateRoom(roomId: IRoom["id"], fields: TRoomUpdateAttributes) {
  return Room.update(fields, { where: { id: roomId } });
}

export function deleteRoom(roomId: IRoom["id"]) {
  return Room.destroy({ where: { id: roomId } });
}
