import { Optional } from "sequelize";
import { MessageModel } from "../models/message";
import { IConversation } from "./conversation";
import { IRoom } from "./room";
import { IUser } from "./user";

export interface IMessage {
  id: number;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type TMessageWithAuthor = MessageModel & {
  author: IUser;
};

export interface IFullMessage extends IMessage {
  author: IUser;
  room?: IRoom;
  conversation?: IConversation;
}

export type MessageCreationAttributes = Optional<IMessage, "id">;
