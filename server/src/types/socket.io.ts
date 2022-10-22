import { Socket as IOSocket } from "socket.io";
import { IUser } from "./user";

export interface EmitEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ListenEvents {
  hello: () => void;
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
