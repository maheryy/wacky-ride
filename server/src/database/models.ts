import { Sequelize } from "sequelize";
import Conversation from "../models/conversation";
import Message from "../models/message";
import Room from "../models/room";
import User from "../models/user";

export const getModels = (sequelize: Sequelize) => {
  const models = {
    User: User(sequelize),
    Room: Room(sequelize),
    Message: Message(sequelize),
    Conversation: Conversation(sequelize),
  };

  Object.values(models).forEach((model) => {
    if (model.associate) {
      model.associate(models);
    }
  });

  return models;
};
