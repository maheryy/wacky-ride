import { Optional } from "sequelize";
import { ConversationModel } from "../models/conversation";
import { MessageModel } from "../models/message";
import { RoomModel } from "../models/room";
import { UserModel } from "../models/user";

export interface IMessage {
  id: number;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type TMessageWithAuthor = MessageModel & {
  author: UserModel;
};

export type TMessageWithConversation = TMessageWithAuthor & {
  room: RoomModel;
  conversation: ConversationModel;
};

export type TMessageWithRoom = TMessageWithAuthor & {
  room: RoomModel;
  conversation: ConversationModel;
};

export type MessageCreationAttributes = Optional<IMessage, "id">;
