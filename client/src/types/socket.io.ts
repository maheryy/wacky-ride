import { IConversation } from "./conversation";
import { IMessage } from "./message";
import { TListenEvent } from "./result";
import { IRoom } from "./room";

export interface IListenEvents {
  "conversation:message:received": TListenEvent<{ message: IMessage }>;
  "conversation:load": TListenEvent<{
    conversation: IConversation;
    messages: IMessage[];
  }>;
  "room:message:received": TListenEvent<{ message: IMessage }>;
  "room:load": TListenEvent<{ room: IRoom; messages: IMessage[] }>;
}

export interface IEmitEvents {
  "conversation:open": (receiverId: number) => void;
  "conversation:close": (conversationId: number) => void;
  "conversation:message:send": (message: Omit<IMessage, "id">) => void;
  "room:join": (roomId: number) => void;
  "room:leave": (roomId: number) => void;
  "room:message:send": (message: Omit<IMessage, "id">) => void;
}
