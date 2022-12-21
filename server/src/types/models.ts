import { ContactModel } from "../models/contact";
import { ConversationModel } from "../models/conversation";
import { MessageModel } from "../models/message";
import { RoomModel } from "../models/room";
import { UserModel } from "../models/user";

export interface IListModel {
  User: typeof UserModel;
  Room: typeof RoomModel;
  Message: typeof MessageModel;
  Conversation: typeof ConversationModel;
  Contact: typeof ContactModel;
}

export type DatabaseModel =
  | typeof UserModel
  | typeof RoomModel
  | typeof MessageModel
  | typeof ConversationModel
  | typeof ContactModel;
