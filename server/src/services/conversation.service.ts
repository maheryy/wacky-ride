import { Op } from "sequelize";
import { db } from "../database/sequelize";
import { IConversation } from "../types/conversation";

export const createConversation = async (
  senderId: number,
  receiverId: number
): Promise<IConversation> => {
  return db.Conversation.create({
    senderId: senderId,
    receiverId: receiverId,
    status: 0,
  });
};

export const getConversationBetweenUsers = async (
  userId1: number,
  userId2: number
): Promise<IConversation | null> => {
  return db.Conversation.findOne({
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
    include: [
      {
        model: db.User,
        as: "sender",
      },
      {
        model: db.User,
        as: "receiver",
      },
    ],
  });
};
