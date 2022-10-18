import { Optional } from "sequelize";
import { IConversation } from "./conversation";
import { IRoom } from "./room";
import { IUser } from "./user";

export interface IMessage {
  id: number;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFullMessage extends IMessage {
  user: IUser;
  room: IRoom;
  conversation: IConversation;
}

export type MessageCreationAttributes = Optional<IMessage, "id">;
