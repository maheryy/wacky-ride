import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { TUserWithConversationsAndRooms } from "../../types/user";
import { TAdminEmitEvents, TAdminListenEvents } from "./admin";
import { TMainEmitEvents, TMainListenEvents } from "./main";
import { TEmitEvent } from "./result";

export type TListenEvents = TMainListenEvents | TAdminListenEvents;

export type TEmitEvents = (TMainEmitEvents | TAdminEmitEvents) & {
  "user:connected": TEmitEvent<{ user: TUserWithConversationsAndRooms }>;
};

/**
 * IO Server
 */
export type TServer = Server<TListenEvents, TEmitEvents>;

/**
 * Socket Data
 */
type TSocketData = {
  user: TUserWithConversationsAndRooms;
};

/**
 * Socket
 */

export type TSocket = Socket<
  TListenEvents,
  TEmitEvents,
  DefaultEventsMap,
  TSocketData
>;
