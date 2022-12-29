import { Optional } from "sequelize";
import { RoomModel } from "../models/room";
import { TMessageWithAuthor } from "./message";
import { IUser } from "./user";

export interface IRoom {
  id: number;
  name: string;
  limit: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type TRoomWithUsersAndMessages = RoomModel & {
  users: IUser[];
  messages: TMessageWithAuthor[];
};

export type TRoomCreationAttributes = Optional<IRoom, "id">;

export type TRoomUpdateAttributes = Partial<Pick<IRoom, "limit" | "name">>;
