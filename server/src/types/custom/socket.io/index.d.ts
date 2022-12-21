import { IUser } from "../../user";

declare module "node:http" {
  interface IncomingMessage {
    user: IUser;
  }
}
