import { IContact } from "./contact";
import { IConversation } from "./conversation";
import { TMessage } from "./message";
import { TListenEvent } from "./result";
import {
  IRoom,
  TRoomUpdateAttributes,
  TRoomWithUsersAndMessages,
} from "./room";
import { IUser, TUserWithConversationsAndRooms } from "./user";

export interface IListenEvents {
  "user:connected": TListenEvent<{ user: TUserWithConversationsAndRooms }>;
  "conversation:message:received": TListenEvent<{ message: TMessage }>;
  "room:message:received": TListenEvent<{ message: TMessage }>;
  "room:joined": TListenEvent<{ room: TRoomWithUsersAndMessages }>;
  "room:left": TListenEvent<{ roomId: IRoom["id"] }>;
  "contact:created": TListenEvent<{ contact: IContact }>;
  "admin:status": TListenEvent<boolean>;
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
  "contact:create": () => void;
  "admin:status": () => void;
}

export interface IAdminListenEvents {
  "admin:status:updated": TListenEvent<{ status: IUser["status"] }>;
  "room:created": TListenEvent<{ room: IRoom }>;
  "room:deleted": TListenEvent<{ id: IRoom["id"] }>;
  "room:updated": TListenEvent<{
    id: IRoom["id"];
    fields: TRoomUpdateAttributes;
  }>;
  "room:restored": TListenEvent<{ room: IRoom }>;
  "contact:created": TListenEvent<{ contact: IContact }>;
  "contact:accepted": TListenEvent<{
    contact: IContact;
    conversation: IConversation;
  }>;
  "contact:refused": TListenEvent<{ contact: IContact }>;
}

export interface IAdminEmitEvents {
  "admin:status:update": (status: IUser["status"]) => void;
  "room:create": (roomName: IRoom["name"]) => void;
  "room:delete": (id: IRoom["id"]) => void;
  "room:update": (id: IRoom["id"], fields: TRoomUpdateAttributes) => void;
  "room:restore": (id: IRoom["id"]) => void;
  "contact:accept": (contactId: IContact["id"]) => void;
  "contact:refuse": (contactId: IContact["id"]) => void;
}
