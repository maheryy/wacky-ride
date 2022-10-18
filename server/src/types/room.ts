import { Optional } from "sequelize";

export interface IRoom {
  id: number;
  name: string;
  limit: number;
  status: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type RoomCreationAttributes = Optional<IRoom, "id" | "limit" | "status">;
