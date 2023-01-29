import { strEnum } from "../utils/strEnum";
import { IConversation } from "./conversation";
import { IRoom } from "./room";

export const UserStatus = ["online", "idle", "dnd", "invisible"] as const;

export const EUserStatus = strEnum(UserStatus);

export type TUserStatus = keyof typeof EUserStatus;

export type TTranslatedUserStatus = {
  [key in TUserStatus]: string;
};

export const translatedUserStatus: TTranslatedUserStatus = {
  online: "En ligne",
  idle: "Absent",
  dnd: "Ne pas déranger",
  invisible: "Invisible",
};

export interface IUser {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  status?: TUserStatus;
}

export type TUserWithConversationsAndRooms = IUser & {
  senderConversations: IConversation[];
  receiverConversations: IConversation[];
  rooms: IRoom[];
};

export interface IUserCredentials {
  email: string;
  password: string;
}

