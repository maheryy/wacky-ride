import { IUser } from "./user";

export interface IMessage {
  id: number;
  content: string;
  user: IUser;
  createdAt: Date;
}
