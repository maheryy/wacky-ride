import { IConversation } from "./conversation";
import { IRoom } from "./room";
import { IUser } from "./user";
export interface IMessage {
  id: number;
  content: string;
  author: IUser;
  room?: IRoom;
  conversation?: IConversation;
  createdAt?: Date;
  updatedAt?: Date;
}
