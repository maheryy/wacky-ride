import { Optional } from "sequelize";
import { ConversationModel } from "../models/conversation";
import { UserModel } from "../models/user";
import { TMessageWithAuthor } from "./message";

export interface IConversation {
  id: number;
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

export type ConversationCreationAttributes = Optional<IConversation, "id">;

