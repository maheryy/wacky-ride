import { TMessage } from "./message";
import { IUser } from "./user";

export interface IRoom {
  id: number;
  name: string;
  limit: number;
  status: number;
  createdAt: Date;
}

type TRoomWithUsers = IRoom & {
  users: IUser[];
};

type TRoomWithMessages = IRoom & {
  messages: TMessage[];
};

export type TRoomWithUsersAndMessages = TRoomWithUsers & TRoomWithMessages;

export type TRoomUpdateAttributes = Partial<Pick<IRoom, "limit" | "name">>;
