import { Sequelize } from "sequelize";
import Contact from "../models/contact";
import Conversation from "../models/conversation";
import Message from "../models/message";
import Room from "../models/room";
import User from "../models/user";
import { DatabaseModel, IListModel } from "../types/models";

export const getModels = (sequelize: Sequelize): IListModel => {
  const models: IListModel = {
    User: User(sequelize),
    Room: Room(sequelize),
    Conversation: Conversation(sequelize),
    Message: Message(sequelize),
    Contact: Contact(sequelize),
  };

  Object.values(models).forEach(
    (model: DatabaseModel) => model.associate && model.associate(models)
  );

  return models;
};
