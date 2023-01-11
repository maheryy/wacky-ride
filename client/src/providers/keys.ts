import { InjectionKey } from "vue";
import { TSocket } from "../types/socket.io";

export const socketKey = Symbol("socket") as InjectionKey<TSocket>;

export const adminSocketKey = Symbol("adminSocket") as InjectionKey<TSocket>;
