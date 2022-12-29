import { Server, Socket } from "socket.io";
import { IContact } from "../../types/contact";
import { IConversation } from "../../types/conversation";
import { IFullMessage } from "../../types/message";
import { IRoom, TRoomWithUsersAndMessages } from "../../types/room";
import { TEmitEvent } from "./result";

/**
 * Conversation
 */

export interface IConversationListenEvents {
  "conversation:open": (receiverId: number) => void;
  "conversation:close": (conversationId: number) => void;
  "conversation:message:send": (message: Omit<IFullMessage, "id">) => void;
}

export interface IConversationEmitEvents {
  "conversation:message:received": TEmitEvent<{ message: IFullMessage }>;
  "conversation:load": TEmitEvent<{
    conversation: IConversation;
    messages: IFullMessage[];
  }>;
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
  "room:message:send": (message: Omit<IFullMessage, "id">) => void;
  "room:join": (roomId: number) => void;
  "room:leave": (roomId: number) => void;
  rooms: () => void;
}

export interface IRoomEmitEvents {
  "room:message:received": TEmitEvent<{ message: IFullMessage }>;
  "room:joined": TEmitEvent<{ room: TRoomWithUsersAndMessages }>;
  "room:left": TEmitEvent<{ roomId: number }>;
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
