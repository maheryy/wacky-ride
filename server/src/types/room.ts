import { Optional } from "sequelize";
import { MessageModel } from "../models/message";
import { RoomModel } from "../models/room";
import { UserModel } from "../models/user";

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

export type TRoomWithUsersAndMessages = TRoomWithUsers & {
  messages: MessageModel[];
};

export type TRoomCreationAttributes = Optional<IRoom, "id">;

export type TRoomUpdateAttributes = Partial<Pick<IRoom, "limit" | "name">>;
