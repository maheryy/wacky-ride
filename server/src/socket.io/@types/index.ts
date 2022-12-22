import { Server, Socket } from "socket.io";
import { TAdminEmitEvents, TAdminListenEvents } from "./admin";
import { TMainEmitEvents, TMainListenEvents } from "./main";

export type TListenEvents = TMainListenEvents | TAdminListenEvents;

export type TEmitEvents = TMainEmitEvents | TAdminEmitEvents;

/**
 * IO Server
 */
export type TServer = Server<TListenEvents, TEmitEvents>;

/**
 * Socket
 */

export type TSocket = Socket<TListenEvents, TEmitEvents>;
