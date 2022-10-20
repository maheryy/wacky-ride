import {
  HasOneCreateAssociationMixin,
  HasOneSetAssociationMixin,
} from "sequelize";
import {
  Sequelize,
  DataTypes,
  Model,
  NonAttribute,
  HasOneGetAssociationMixin,
} from "sequelize";
import { MessageCreationAttributes } from "../types/message";
import { IListModel } from "../types/models";
import { ConversationModel } from "./conversation";
import { RoomModel } from "./room";
import { UserModel } from "./user";
import { faker } from "@faker-js/faker";
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

  declare static associate?: (models: IListModel) => void;
  declare static seed?: (models: IListModel) => Promise<void>;
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

  MessageModel.associate = (models: IListModel) => {
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

  MessageModel.seed = async (models: IListModel) => {
    const messages: MessageCreationAttributes[] = Array.from(
      { length: 50 },
      () => ({
        content: faker.lorem.sentence(),
      })
    );

    const users = await models.User.findAll();
    const rooms = await models.Room.findAll();
    const conversations = await models.Conversation.findAll();

    await Promise.all(
      messages.map(async (message, key) => {
        const user = users[Math.floor(Math.random() * users.length)];
        const room = rooms[Math.floor(Math.random() * rooms.length)];
        const conversation =
          conversations[Math.floor(Math.random() * conversations.length)];

        const newMessage = await models.Message.create(message);

        return Promise.all([
          newMessage.setUser(user),
          key % 2 === 0
            ? newMessage.setRoom(room)
            : newMessage.setConversation(conversation),
        ]);
      })
    );
  };

  return MessageModel;
};

export default Message;
