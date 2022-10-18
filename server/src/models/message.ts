import { HasOneCreateAssociationMixin, HasOneSetAssociationMixin } from "sequelize";
import { Sequelize, DataTypes, Model, Optional, NonAttribute, HasOneGetAssociationMixin } from "sequelize";
import { IMessage } from "../types/message";
import { ConversationModel } from "./conversation";
import { RoomModel } from "./room";
import { UserModel } from "./user";

export class MessageModel extends Model {
  declare id: number;
  declare content: string;

  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;

  declare user?: NonAttribute<UserModel>;
  declare room?: NonAttribute<RoomModel>;
  declare conversation?: NonAttribute<ConversationModel>;

  declare getUser: HasOneGetAssociationMixin<UserModel>;
  declare setUser: HasOneSetAssociationMixin<UserModel, number>;
  // declare createUser: HasOneCreateAssociationMixin<UserModel>;

  declare getRoom: HasOneGetAssociationMixin<RoomModel>;
  declare setRoom: HasOneSetAssociationMixin<RoomModel, number>;

  declare getConversation: HasOneGetAssociationMixin<ConversationModel>;
  declare setConversation: HasOneSetAssociationMixin<ConversationModel, number>;

  declare static associate?: (models: any) => void;
  declare static seed?: () => Promise<any>;
}

const Message = (sequelize: Sequelize): typeof MessageModel => {
  MessageModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      content: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "message",
      sequelize,
    }
  );

  MessageModel.associate = (models: any) => {
    MessageModel.belongsTo(models.User, {
      as: "user",
      foreignKey: "userId",
    });
    MessageModel.belongsTo(models.Room, {
      as: "room",
      foreignKey: "roomId",
    });
    MessageModel.belongsTo(models.Conversation, {
      as: "conversation",
      foreignKey: "conversationId",
    });
  };

  MessageModel.seed = async () => {};

  return MessageModel;
};

export default Message;
