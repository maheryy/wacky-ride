import { db } from "../database/sequelize";
import { TFullMessage } from "../types/message";

const { Message, User } = db;

export type TMessage =
  | {
      content: string;
      authorId: number;
    } & (
      | {
          roomId: number;
          conversationId?: never;
        }
      | {
          roomId?: never;
          conversationId: number;
        }
    );

export function createMessage(fields: TMessage) {
  return Message.create(fields);
}

export const getMessagesByConversation = async (
  conversationId: number
): Promise<TFullMessage[]> => {
  return Message.findAll({
    where: {
      conversationId: conversationId,
    },
    order: [["createdAt", "ASC"]],
    include: [
      {
        model: User,
        as: "author",
      },
    ],
  }) as Promise<TFullMessage[]>;
};

export const getMessagesByRoom = async (
  roomId: number
): Promise<TFullMessage[]> => {
  return Message.findAll({
    where: {
      roomId: roomId,
    },
    order: [["createdAt", "ASC"]],
    include: [
      {
        model: User,
        as: "author",
      },
    ],
  }) as Promise<TFullMessage[]>;
};
