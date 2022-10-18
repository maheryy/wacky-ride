import { Optional } from "sequelize";

export interface IConversation {
  id: number;
  status: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ConversationCreationAttributes = Optional<
  IConversation,
  "id" | "status"
>;
