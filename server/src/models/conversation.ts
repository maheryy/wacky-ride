import { faker } from "@faker-js/faker";
import {
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import { IListModel } from "../types/models";
import { MessageModel } from "./message";
import { UserModel } from "./user";

export class ConversationModel extends Model {
  declare id: number;
  declare status: number;

  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;

  declare sender?: NonAttribute<UserModel>;
  declare receiver?: NonAttribute<UserModel>;
  declare messages?: NonAttribute<MessageModel[]>;

  declare getSender: HasOneGetAssociationMixin<UserModel>;
  declare setSender: HasOneSetAssociationMixin<UserModel, number>;

  declare getReceiver: HasOneGetAssociationMixin<UserModel>;
  declare setReceiver: HasOneSetAssociationMixin<UserModel, number>;

  declare getMessages: HasManyGetAssociationsMixin<MessageModel>;
  declare addMessage: HasManyAddAssociationMixin<MessageModel, number>;
  declare removeMessage: HasManyRemoveAssociationMixin<MessageModel, number>;
  declare hasMessages: HasManyHasAssociationsMixin<MessageModel, number>;
  declare hasMessage: HasManyHasAssociationMixin<MessageModel, number>;
  declare countMessages: HasManyCountAssociationsMixin;
  declare createMessage: HasManyCreateAssociationMixin<MessageModel>;

  declare static associate?: (models: IListModel) => void;
  declare static seed?: (models: IListModel) => Promise<void>;
}

const Conversation = (sequelize: Sequelize): typeof ConversationModel => {
  ConversationModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
    },
    {
      tableName: "conversation",
      sequelize,
    }
  );

  ConversationModel.associate = (models: IListModel) => {
    ConversationModel.belongsTo(models.User, {
      as: "sender",
      foreignKey: "senderId",
    });
    ConversationModel.belongsTo(models.User, {
      as: "receiver",
      foreignKey: "receiverId",
    });
    ConversationModel.hasMany(models.Message, {
      as: "messages",
      foreignKey: "conversationId",
    });
  };

  ConversationModel.seed = async (models: IListModel) => {
    const users = await models.User.findAll();
    const binds: string[] = [];

    for (let i = 0; i < 15; i++) {
      const randomUser1 = [
        users[0],
        users[1],
        faker.helpers.arrayElement(users),
      ][i % 3];
      const randomUser2 = faker.helpers.arrayElement(users);

      if (
        randomUser1.id == randomUser2.id ||
        binds.includes(`${randomUser2.id}-${randomUser1.id}`)
      ) {
        i--;
        continue;
      }

      const conversation = await ConversationModel.create({ status: 0 });

      await conversation.setSender(randomUser1);
      await conversation.setReceiver(randomUser2);
      binds.push(`${randomUser1.id}-${randomUser2.id}`);
    }
  };

  return ConversationModel;
};

export default Conversation;
