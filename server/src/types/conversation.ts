import { Optional } from "sequelize";
import { ConversationModel } from "../models/conversation";
import { MessageModel } from "../models/message";
import { UserModel } from "../models/user";
import { TMessageWithAuthor } from "./message";

export interface IConversation {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type TConversationWithMessages = ConversationModel & {
  messages: TMessageWithAuthor;
};

export type TFullConversation = TConversationWithMessages & {
  sender: UserModel;
  receiver: UserModel;
};

export type ConversationCreationAttributes = Optional<IConversation, "id">;
