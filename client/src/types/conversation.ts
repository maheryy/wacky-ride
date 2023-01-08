import { TMessage } from "./message";

export interface IConversation {
  id: number;
  createdAt: Date;
  receiverId: number;
  senderId: number;
}

export type TConversationWithMessages = IConversation & {
  messages: TMessage[];
};
