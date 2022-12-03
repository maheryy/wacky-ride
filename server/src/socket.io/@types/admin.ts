import { Server, Socket } from "socket.io";
import { IUser } from "../../types/user";

/**
 * User
 */

export interface IUserListenEvents {
  "user-status:update": (status: IUser["status"]) => void;
}

export interface IUserEmitEvents {
  "user-status:updated": (status: IUser["status"]) => void;
}

export type TUserIO = Server<IUserListenEvents, IUserEmitEvents>;

export type TUserSocket = Socket<IUserListenEvents, IUserEmitEvents>;

export type TAdminListenEvents = IUserListenEvents;

export type TAdminEmitEvents = IUserEmitEvents;
