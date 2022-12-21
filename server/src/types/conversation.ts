import { Optional } from "sequelize";
import { IMessage } from "./message";
import { IUser } from "./user";

export interface IConversation {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFullConversation extends IConversation {
  sender?: IUser;
  receiver?: IUser;
  messages?: IMessage[];
}

export type ConversationCreationAttributes = Optional<IConversation, "id">;
