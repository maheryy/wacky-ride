import { TMessage } from "./message";
import { IUser } from "./user";

export interface IConversation {
  id: number;
  createdAt: Date;
  endedAt: string;
  receiver: Pick<IUser, "id" | "username">;
  sender: Pick<IUser, "id" | "username">;
}

export type TConversationWithMessages = IConversation & {
  messages: TMessage[];
};

