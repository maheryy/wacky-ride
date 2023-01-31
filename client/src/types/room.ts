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

export type TRoomCreate = Pick<IRoom, "limit" | "name">;

export type TRoomUpdate = Pick<IRoom, "id"> &
  Partial<Pick<IRoom, "limit" | "name">>;
