import { IConversation } from "./conversation";
import { IMessage } from "./message";
import { IRoom } from "./room";

export interface ListenEvents {
  "conversation:message:received": (message: IMessage) => void;
  "conversation:load": (
    conversation: IConversation,
    messages: IMessage[]
  ) => void;
  "room:message:received": (message: IMessage) => void;
  "room:load": (room: IRoom, messages: IMessage[]) => void;
}

export interface EmitEvents {
  "conversation:open": (userId: number) => void;
  "conversation:close": (userId: number) => void;
  "conversation:message:send": (message: Omit<IMessage, "id">) => void;
  "room:join": (roomId?: number) => void;
  "room:leave": (roomId: number) => void;
  "room:message:send": (message: Omit<IMessage, "id">) => void;
}
