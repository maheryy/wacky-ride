import { Optional } from "sequelize";
import { ConversationModel } from "../models/conversation";
import { MessageModel } from "../models/message";
import { UserModel } from "../models/user";

export interface IConversation {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type TFullConversation = ConversationModel & {
  sender: UserModel;
  receiver: UserModel;
  messages: MessageModel[];
};

export type ConversationCreationAttributes = Optional<IConversation, "id">;
