import { Optional } from "sequelize";
import { RoomModel } from "../models/room";
import { UserModel } from "../models/user";
import { TMessageWithAuthor } from "./message";

export interface IRoom {
  id: number;
  name: string;
  limit: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type TRoomWithUsers = RoomModel & {
  users: UserModel[];
};

export type TRoomWithMessages = RoomModel & {
  messages: TMessageWithAuthor[];
};

export type TRoomWithUsersAndMessages = TRoomWithUsers & TRoomWithMessages;

export type TRoomCreationAttributes = Optional<IRoom, "id">;

export type TRoomUpdateAttributes = Partial<Pick<IRoom, "limit" | "name">>;

export type TRoomCreate = Pick<IRoom, "limit" | "name">;

export type TRoomUpdate = Pick<IRoom, "id"> &
  Partial<Pick<IRoom, "limit" | "name">>;
