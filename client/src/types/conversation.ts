import { TMessage } from "./message";
import { IUser } from "./user";

export interface IConversation {
  id: number;
  createdAt: Date;
  endedAt: string;
  receiver: Pick<IUser, "id" | "username" | "isAdmin">;
  sender: Pick<IUser, "id" | "username" | "isAdmin">;
}

export type TConversationWithMessages = IConversation & {
  messages: TMessage[];
};
