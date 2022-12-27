import { db } from "../database/sequelize";
import { IFullRoom, IRoom } from "../types/room";

export function createRoom(roomName: string) {
  return db.Room.create({
    name: roomName,
  });
}

export const getRoomById = async (roomId: number): Promise<IRoom | null> => {
  return db.Room.findByPk(roomId);
};

export const getRoomByIdWithUsersAndMessages = async (
  roomId: number
): Promise<IFullRoom | null> => {
  return db.Room.findByPk(roomId, {
    include: [
      {
        model: db.User,
        as: "users",
      },
      {
        model: db.Message,
        as: "messages",
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: db.User,
            as: "author",
          },
        ],
      },
    ],
  }) as Promise<IFullRoom | null>;
};

export function updateRoomName(roomId: IRoom["id"], name: IRoom["name"]) {
  return db.Room.update(
    {
      name,
    },
    {
      where: {
        id: roomId,
      },
    }
  );
}
