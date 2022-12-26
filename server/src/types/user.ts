import { Optional } from "sequelize";
import { strEnum } from "../utils/strEnum";

export const UserStatus = ["online", "idle", "dnd", "invisible"] as const;

export const EUserStatus = strEnum(UserStatus);

export type TUserStatus = keyof typeof EUserStatus;

export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  status: TUserStatus;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type TUserCreationAttributes = Optional<IUser, "id" | "isAdmin">;

export type TUserUpdateAttributes = Partial<Omit<IUser, "id" | "isAdmin">>;
