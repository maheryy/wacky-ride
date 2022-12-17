import { Server, Socket } from "socket.io";
import { IUser } from "../../types/user";
import { TEmitEvent } from "./result";

/**
 * User
 */

export interface IUserListenEvents {
  "user-status:update": (status: IUser["status"]) => Promise<void>;
}

export interface IUserEmitEvents {
  "user-status:updated": TEmitEvent<{ status: IUser["status"] }>;
}

export type TUserIO = Server<IUserListenEvents, IUserEmitEvents>;

export type TUserSocket = Socket<IUserListenEvents, IUserEmitEvents>;

export type TAdminListenEvents = IUserListenEvents;

export type TAdminEmitEvents = IUserEmitEvents;
