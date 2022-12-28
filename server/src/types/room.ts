import { Optional } from "sequelize";
import { IMessage } from "./message";
import { IUser } from "./user";

export interface IRoom {
  id: number;
  name: string;
  limit: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IFullRoom extends IRoom {
  users?: IUser[];
  messages?: IMessage[];
}

export type TRoomCreationAttributes = Optional<IRoom, "id">;

export type TRoomUpdateAttributes = Partial<Pick<IRoom, "limit" | "name">>;
