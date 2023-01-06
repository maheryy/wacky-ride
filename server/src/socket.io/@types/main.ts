import { Server, Socket } from "socket.io";
import { IContact } from "../../types/contact";
import { IMessage } from "../../types/message";
import { IRoom, TRoomWithUsersAndMessages } from "../../types/room";
import { IUser } from "../../types/user";
import { TEmitEvent } from "./result";

/**
 * Conversation
 */

export interface IConversationListenEvents {
  "conversation:message:send": (
    receiverId: IUser["id"],
    content: IMessage["content"]
  ) => void;
}

export interface IConversationEmitEvents {
  "conversation:message:received": TEmitEvent<{ message: IMessage }>;
}

export type TConversationIO = Server<
  IConversationListenEvents,
  IConversationEmitEvents
>;

export type TConversationSocket = Socket<
  IConversationListenEvents,
  IConversationEmitEvents
>;

/**
 * Room
 */

export interface IRoomListenEvents {
  "room:message:send": (
    roomId: IRoom["id"],
    content: IMessage["content"]
  ) => void;
  "room:join": (roomId: IRoom["id"]) => void;
  "room:leave": (roomId: IRoom["id"]) => void;
  rooms: () => void;
}

export interface IRoomEmitEvents {
  "room:message:received": TEmitEvent<{ message: IMessage }>;
  "room:joined": TEmitEvent<{ room: TRoomWithUsersAndMessages }>;
  "room:left": TEmitEvent<{ roomId: IRoom["id"] }>;
  rooms: TEmitEvent<{ rooms: IRoom[] }>;
}

export type TRoomIO = Server<IRoomListenEvents, IRoomEmitEvents>;

export type TRoomSocket = Socket<IRoomListenEvents, IRoomEmitEvents>;

/**
 * Contact
 */

export interface IContactListenEvents {
  "contact:create": () => void;
}

export interface IContactEmitEvents {
  "contact:created": TEmitEvent<{ contact: IContact }>;
}

export type TContactIO = Server<IContactListenEvents, IContactEmitEvents>;

export type TContactSocket = Socket<IContactListenEvents, IContactEmitEvents>;

/**
 * User
 */

export interface IUserListenEvents {
  "admin:status": () => void;
}

export interface IUserEmitEvents {
  "admin:status": TEmitEvent<boolean>;
}

export type TUserIO = Server<IUserListenEvents, IUserEmitEvents>;

export type TUserSocket = Socket<IUserListenEvents, IUserEmitEvents>;

export type TMainListenEvents =
  | IConversationListenEvents
  | IRoomListenEvents
  | IContactListenEvents
  | IUserListenEvents;

export type TMainEmitEvents =
  | IConversationEmitEvents
  | IRoomEmitEvents
  | IContactEmitEvents
  | IUserEmitEvents;
