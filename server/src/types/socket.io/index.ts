import { Socket } from "socket.io";
import { TAdminEmitEvents, TAdminListenEvents } from "./admin";
import { TMainEmitEvents, TMainListenEvents } from "./main";

export * from "./admin";
export * from "./main";

type TListenEvents = TMainListenEvents | TAdminListenEvents;

type TEmitEvents = TMainEmitEvents | TAdminEmitEvents;

/**
 * Socket
 */

export type TSocket = Socket<TListenEvents, TEmitEvents>;
