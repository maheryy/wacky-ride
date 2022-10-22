import { IConversation } from "./conversation";
import { IRoom } from "./room";
import { IUser } from "./user";
export interface IMessage {
  id: number;
  content: string;
  user: IUser;
  room?: IRoom;
  conversation?: IConversation;
  createdAt?: Date;
  updatedAt?: Date;
}
