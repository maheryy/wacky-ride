import { Server, Socket } from "socket.io";
import { IContact } from "../../types/contact";
import { IConversation } from "../../types/conversation";
import { IRoom } from "../../types/room";
import { IUser } from "../../types/user";
import { TEmitEvent, TListenEvent } from "./result";

/**
 * User
 */

export interface IUserListenEvents {
  "user-status:update": (status: IUser["status"]) => Promise<void>;
}

export interface IUserEmitEvents {
  "user-status:updated": TEmitEvent<{ status: IUser["status"] }>;
}

export type TUserIO = Server<IUserListenEvents, IUserEmitEvents>;

export type TUserSocket = Socket<IUserListenEvents, IUserEmitEvents>;

/**
 * Room
 */

export interface IRoomListenEvents {
  "room:create": (roomName: string) => void;
}

export interface IRoomEmitEvents {
  "room:created": TEmitEvent<{ room: IRoom }>;
}

export type TRoomIO = Server<IRoomListenEvents, IRoomEmitEvents>;

export type TRoomSocket = Socket<IRoomListenEvents, IRoomEmitEvents>;

/**
 * Contact
 */

export interface IContactListenEvents {
  "contact:created": TListenEvent<{ contact: IContact }>;
  "contact:accept": (contactId: IContact["id"]) => void;
  "contact:refuse": (contactId: IContact["id"]) => void;
}

export interface IContactEmitEvents {
  "contact:created": TEmitEvent<{ contact: IContact }>;
  "contact:accepted": TEmitEvent<{
    contact: IContact;
    conversation: IConversation;
  }>;
  "contact:refused": TEmitEvent<{ contact: IContact }>;
}

export type TContactIO = Server<IContactListenEvents, IContactEmitEvents>;

export type TContactSocket = Socket<IContactListenEvents, IContactEmitEvents>;

export type TAdminListenEvents =
  | IUserListenEvents
  | IRoomListenEvents
  | IContactListenEvents;

export type TAdminEmitEvents =
  | IUserEmitEvents
  | IRoomEmitEvents
  | IContactEmitEvents;
