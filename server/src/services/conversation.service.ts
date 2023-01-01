import { Op } from "sequelize";
import { db } from "../database/sequelize";
import { IUser } from "../types/user";

const { Conversation } = db;

export const createConversation = async (
  senderId: IUser["id"],
  receiverId: IUser["id"]
) => {
  return Conversation.create({
    senderId,
    receiverId,
  });
};

export function getOrCreateConversation(
  userId1: IUser["id"],
  userId2: IUser["id"]
) {
  return Conversation.findOrCreate({
    defaults: {
      senderId: userId1,
      receiverId: userId2,
    },
    where: {
      [Op.or]: [
        {
          senderId: userId1,
          receiverId: userId2,
        },
        {
          senderId: userId2,
          receiverId: userId1,
        },
      ],
    },
  });
}
