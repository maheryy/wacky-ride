import { db } from "../database/sequelize";
import { IFullMessage } from "../types/message";

export const createMessageWithinConversation = async (
  message: string,
  authorId: number,
  conversationId: number
): Promise<IFullMessage> => {
  return db.Message.create({
    content: message,
    authorId: authorId,
    conversationId: conversationId,
  }) as Promise<IFullMessage>;
};

export const createMessageWithinRoom = async (
  message: string,
  authorId: number,
  roomId: number
): Promise<IFullMessage> => {
  return db.Message.create({
    content: message,
    authorId: authorId,
    roomId: roomId,
  }) as Promise<IFullMessage>;
};

export const getMessagesByConversation = async (
  conversationId: number
): Promise<IFullMessage[]> => {
  return db.Message.findAll({
    where: {
      conversationId: conversationId,
    },
    order: [["createdAt", "ASC"]],
    include: [
      {
        model: db.User,
        as: "author",
      },
    ],
  }) as Promise<IFullMessage[]>;
};

export const getMessagesByRoom = async (
  roomId: number
): Promise<IFullMessage[]> => {
  return db.Message.findAll({
    where: {
      roomId: roomId,
    },
    order: [["createdAt", "ASC"]],
    include: [
      {
        model: db.User,
        as: "author",
      },
    ],
  }) as Promise<IFullMessage[]>;
};
