import { Server, Socket } from "socket.io";
import { IConversation } from "../../types/conversation";
import { IFullMessage } from "../../types/message";
import { IRoom } from "../../types/room";

/**
 * Conversation
 */

export interface IConversationListenEvents {
  "conversation:open": (receiverId: number) => void;
  "conversation:close": (conversationId: number) => void;
  "conversation:message:send": (message: Omit<IFullMessage, "id">) => void;
}

export interface IConversationEmitEvents {
  "conversation:message:received": (message: IFullMessage) => void;
  "conversation:load": (
    conversation: IConversation,
    messages: IFullMessage[]
  ) => void;
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
}

export interface IRoomEmitEvents {
  "room:message:received": (message: IFullMessage) => void;
  "room:load": (room: IRoom, messages: IFullMessage[]) => void;
}

export type TRoomIO = Server<IRoomListenEvents, IRoomEmitEvents>;

export type TRoomSocket = Socket<IRoomListenEvents, IRoomEmitEvents>;

export type TMainListenEvents = IConversationListenEvents | IRoomListenEvents;

export type TMainEmitEvents = IConversationEmitEvents | IRoomEmitEvents;
