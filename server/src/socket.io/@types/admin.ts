import { Server, Socket } from "socket.io";
import { IContact, TContactWithUser } from "../../types/contact";
import { IConversation } from "../../types/conversation";
import { IRoom, TRoomCreate, TRoomUpdate } from "../../types/room";
import { IUser } from "../../types/user";
import { TEmitEvent } from "./result";

/**
 * Namespace
 */

export interface IEmitEvents {
  "admin:connected": TEmitEvent<{ userId: IUser["id"] }>;
  "admin:disconnected": TEmitEvent<{ userId: IUser["id"] }>;
}

/**
 * User
 */

export interface IUserListenEvents {
  "admin:status:update": (status: IUser["status"]) => Promise<void>;
}

export type TUserEmitEvents = IEmitEvents & {
  "admin:status:updated": TEmitEvent<{ status: IUser["status"] }>;
};

export type TUserIO = Server<IUserListenEvents, TUserEmitEvents>;

export type TUserSocket = Socket<IUserListenEvents, TUserEmitEvents>;

/**
 * Room
 */

export interface IRoomListenEvents {
  "room:create": (room: TRoomCreate) => void;
  "room:delete": (id: IRoom["id"]) => void;
  "room:update": (room: TRoomUpdate) => void;
  "room:restore": (id: IRoom["id"]) => void;
}

export interface IRoomEmitEvents {
  "room:created": TEmitEvent<{ room: IRoom }>;
  "room:deleted": TEmitEvent<{ id: IRoom["id"] }>;
  "room:updated": TEmitEvent<{ room: TRoomUpdate }>;
  "room:restored": TEmitEvent<{ room: IRoom }>;
}

export type TRoomIO = Server<IRoomListenEvents, IRoomEmitEvents>;

export type TRoomSocket = Socket<IRoomListenEvents, IRoomEmitEvents>;

/**
 * Contact
 */

export interface IContactListenEvents {
  contacts: (page: number) => void;
  "contact:accept": (contactId: IContact["id"]) => void;
  "contact:refuse": (contactId: IContact["id"]) => void;
  "contacts:count": () => void;
}

export interface IContactEmitEvents {
  contacts: TEmitEvent<{
    contacts: TContactWithUser[];
    count: number;
    maxPage: number;
  }>;
  "contact:created": TEmitEvent<{ contact: IContact }>;
  "contact:accepted": TEmitEvent<{
    contact: IContact;
    conversation: IConversation;
  }>;
  "contact:refused": TEmitEvent<{ contact: IContact }>;
  "contacts:count": TEmitEvent<{ count: number }>;
}

export type TContactIO = Server<IContactListenEvents, IContactEmitEvents>;

export type TContactSocket = Socket<IContactListenEvents, IContactEmitEvents>;

export type TAdminListenEvents =
  | IUserListenEvents
  | IRoomListenEvents
  | IContactListenEvents;

export type TAdminEmitEvents = IEmitEvents &
  (TUserEmitEvents | IRoomEmitEvents | IContactEmitEvents);

export type TAdminIO = Server<TAdminListenEvents, TAdminEmitEvents>;

export type TAdminSocket = Socket<TAdminListenEvents, TAdminEmitEvents>;

