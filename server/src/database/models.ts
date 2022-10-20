import { Sequelize } from "sequelize";
import Conversation from "../models/conversation";
import Message from "../models/message";
import Room from "../models/room";
import User from "../models/user";
import { IListModel } from "../types/models";

export const getModels = (sequelize: Sequelize): IListModel => {
  const models = {
    User: User(sequelize),
    Room: Room(sequelize),
    Conversation: Conversation(sequelize),
    Message: Message(sequelize),
  };

  Object.values(models).forEach((model) => {
    if (model.associate) {
      model.associate(models);
    }
  });

  return models;
};
