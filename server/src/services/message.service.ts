import { db } from "../database/sequelize";

const { Message } = db;

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

export const getMessagesByConversation = async (conversationId: number) => {
  return Message.findAll({ where: { conversationId } });
};

export const getMessagesByRoom = async (roomId: number) => {
  return Message.findAll({ where: { roomId } });
};
