import { Optional } from "sequelize";
import { IMessage } from "./message";
import { IUser } from "./user";

export interface IRoom {
  id: number;
  name: string;
  limit: number;
  status: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFullRoom extends IRoom {
  users?: IUser[];
  messages?: IMessage[];
}

export type RoomCreationAttributes = Optional<IRoom, "id" | "limit" | "status">;
