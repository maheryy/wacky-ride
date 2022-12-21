import { Op } from "sequelize";
import { db } from "../database/sequelize";
import { IFullConversation } from "../types/conversation";

export const createConversation = async (
  senderId: number,
  receiverId: number
) => {
  return db.Conversation.create({
    senderId,
    receiverId,
  });
};

export const getConversationBetweenUsers = async (
  userId1: number,
  userId2: number
): Promise<IFullConversation | null> => {
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
  }) as Promise<IFullConversation | null>;
};
