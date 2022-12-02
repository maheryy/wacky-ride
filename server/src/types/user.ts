import { Optional } from "sequelize";

export type TUserStatus = "online" | "idle" | "dnd" | "invisible";

export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  status: TUserStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserCreationAttributes = Optional<
  IUser,
  "id" | "isAdmin" | "status"
>;
