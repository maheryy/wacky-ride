import { Op } from "sequelize";
import { db } from "../database/sequelize";
import { TFullConversation } from "../types/conversation";
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

export function getConversation(userId1: IUser["id"], userId2: IUser["id"]) {
  return Conversation.findOne({
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
  }) as Promise<TFullConversation | null>;
}

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
