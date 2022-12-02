import { Socket } from "socket.io";
import { TMainEmitEvents, TMainListenEvents } from "./main";

export * from "./main";

type TListenEvents = TMainListenEvents;

type TEmitEvents = TMainEmitEvents;

/**
 * Socket
 */

export type TSocket = Socket<TListenEvents, TEmitEvents>;
