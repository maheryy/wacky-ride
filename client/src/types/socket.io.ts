import { Socket } from "socket.io-client";
import { IContact, TContactWithUser } from "./contact";
import { IConversation } from "./conversation";
import { TMessage } from "./message";
import { TListenEvent } from "./result";
import {
  IRoom,
  TRoomCreate,
  TRoomUpdate,
  TRoomWithUsersAndMessages,
} from "./room";
import { IUser, TUserWithConversationsAndRooms } from "./user";

export interface IListenEvents {
  "user:connected": TListenEvent<{ user: TUserWithConversationsAndRooms }>;
  "conversation:message:received": TListenEvent<{ message: TMessage }>;
  "room:message:received": TListenEvent<{ message: TMessage }>;
  "room:joined": TListenEvent<{ room: TRoomWithUsersAndMessages }>;
  "room:left": TListenEvent<{ roomId: IRoom["id"] }>;
  rooms: TListenEvent<{ rooms: IRoom[] }>;
  "contact:created": TListenEvent<{ contact: IContact }>;
  "admin:status": TListenEvent<boolean>;
  conversation: TListenEvent<{ conversation: IConversation }>;
  conversations: TListenEvent<{ conversations: IConversation[] }>;
}

export interface IEmitEvents {
  "conversation:message:send": (
    receiverId: IUser["id"],
    content: TMessage["content"]
  ) => void;
  "room:message:send": (
    roomId: IRoom["id"],
    content: TMessage["content"]
  ) => void;
  "room:join": (roomId: IRoom["id"]) => void;
  "room:leave": (roomId: IRoom["id"]) => void;
  rooms: () => void;
  "contact:create": () => void;
  "admin:status": () => void;
  conversation: (receiverId: IUser["id"]) => void;
  conversations: () => void;
  contacts: (page: number) => void;
}

export interface IAdminListenEvents {
  "admin:status:updated": TListenEvent<{ status: IUser["status"] }>;
  "room:created": TListenEvent<{ room: IRoom }>;
  "room:deleted": TListenEvent<{ id: IRoom["id"] }>;
  "room:updated": TListenEvent<{ room: TRoomUpdate }>;
  "room:restored": TListenEvent<{ room: IRoom }>;
  "contact:created": TListenEvent<{ contact: IContact }>;
  "contact:accepted": TListenEvent<{
    contact: IContact;
    conversation: IConversation;
  }>;
  "contact:refused": TListenEvent<{ contact: IContact }>;
  contacts: TListenEvent<{
    contacts: TContactWithUser[];
    count: number;
    maxPage: number;
  }>;
}

export interface IAdminEmitEvents {
  "admin:status:update": (status: IUser["status"]) => void;
  "room:create": (room: TRoomCreate) => void;
  "room:delete": (id: IRoom["id"]) => void;
  "room:update": (room: TRoomUpdate) => void;
  "room:restore": (id: IRoom["id"]) => void;
  "contact:accept": (contactId: IContact["id"]) => void;
  "contact:refuse": (contactId: IContact["id"]) => void;
}

export type TSocket = Socket<
  IListenEvents & IAdminListenEvents,
  IEmitEvents & IAdminEmitEvents
>;

