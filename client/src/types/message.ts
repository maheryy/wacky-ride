import { IConversation } from "./conversation";
import { IRoom } from "./room";
import { IUser } from "./user";

export type TMessage = {
  id: number;
  content: string;
  author: IUser;
  createdAt: Date;
  updatedAt: Date;
} & (
  | {
      room: IRoom;
      conversation?: never;
    }
  | {
      room?: never;
      conversation: IConversation;
    }
);

export interface IChatbotMessage {
  isBotMessage: boolean;
  content: string;
}
