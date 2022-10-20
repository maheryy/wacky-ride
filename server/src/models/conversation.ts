import {
  Sequelize,
  DataTypes,
  Model,
  NonAttribute,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyRemoveAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
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
    users.forEach(async (user1, i) => {
      users.forEach(async (user2, j) => {
        if (user1.id === user2.id || j < i) return;

        const conversation = await ConversationModel.create({ status: 0 });
        await Promise.all([
          conversation.setSender(user1),
          conversation.setReceiver(user2),
        ]);
      });
    });
  };

  return ConversationModel;
};

export default Conversation;
