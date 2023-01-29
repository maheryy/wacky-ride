import { ContactModel } from "../models/contact";
import { strEnum } from "../utils/strEnum";
import { IUser } from "./user";

export const ContactStatus = ["pending", "accepted", "refused"] as const;

export const EContactStatus = strEnum(ContactStatus);

export type TContactStatus = keyof typeof EContactStatus;

export interface IContact {
  id: number;
  userId: IUser["id"];
  status: TContactStatus;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type TContactWithUser = ContactModel & {
  user: IUser;
};
