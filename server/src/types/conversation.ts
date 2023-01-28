import { ConversationModel } from "../models/conversation";
import { UserModel } from "../models/user";
import { TMessageWithAuthor } from "./message";
import { IUser } from "./user";

export interface IConversation {
  id: number;
  isAdvise: boolean;
  senderId: IUser["id"];
  receiverId: IUser["id"];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  endedAt?: Date;
}

export type TConversationWithUsers = ConversationModel & {
  sender: UserModel;
  receiver: UserModel;
};

export type TConversationWithUsersAndMessages = TConversationWithUsers & {
  messages: TMessageWithAuthor[];
};

export type TConversationCreateAttributes = Pick<
  IConversation,
  "senderId" | "receiverId"
> &
  Partial<Pick<IConversation, "isAdvise">>;

