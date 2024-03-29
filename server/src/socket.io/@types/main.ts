import { Server, Socket } from "socket.io";
import { IContact, TContactWithUser } from "../../types/contact";
import {
  IConversation,
  TConversationWithUsers,
  TConversationWithUsersAndMessages,
} from "../../types/conversation";
import { IMessage } from "../../types/message";
import { IRoom, TRoomWithMessages } from "../../types/room";
import { IUser } from "../../types/user";
import { TEmitEvent } from "./result";

/**
 * Conversation
 */

export interface IConversationListenEvents {
  "conversation:message:send": (
    conversationId: IConversation["id"],
    content: IMessage["content"]
  ) => void;
  conversation: (conversationId: IUser["id"]) => void;
  conversations: () => void;
  "conversation:conversate": (receiverId: IUser["id"]) => void;
}

export interface IConversationEmitEvents {
  "conversation:message:received": TEmitEvent<{ message: IMessage }>;
  conversation: TEmitEvent<{ conversation: TConversationWithUsersAndMessages }>;
  conversations: TEmitEvent<{ conversations: TConversationWithUsers[] }>;
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
  "room:joined": TEmitEvent<{ room: TRoomWithMessages }>;
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
  "contact:created": TEmitEvent<{ contact: TContactWithUser }>;
  "contact:pending": TEmitEvent<{ contact: IContact }>;
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

