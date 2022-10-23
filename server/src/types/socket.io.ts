import { Socket as IOSocket } from "socket.io";
import { IConversation } from "./conversation";
import { IFullMessage, IMessage } from "./message";
import { IRoom } from "./room";

export interface EmitEvents {
  "conversation:message:received": (message: IFullMessage) => void;
  "conversation:load": (
    conversation: IConversation,
    messages: IFullMessage[]
  ) => void;
  "room:message:received": (message: IFullMessage) => void;
  "room:load": (room: IRoom, messages: IFullMessage[]) => void;
}

export interface ListenEvents {
  "conversation:open": (receiverId: number) => void;
  "conversation:close": (conversationId: number) => void;
  "conversation:message:send": (message: Omit<IFullMessage, "id">) => void;
  "room:join": (roomId: number) => void;
  "room:leave": (roomId: number) => void;
  "room:message:send": (message: Omit<IFullMessage, "id">) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}

export type Socket = IOSocket<
  ListenEvents,
  EmitEvents,
  InterServerEvents,
  SocketData
>;
