import { faker } from "@faker-js/faker";
import { HasOneSetAssociationMixin } from "sequelize";
import {
  DataTypes,
  HasOneGetAssociationMixin,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import { IMessage, MessageCreationAttributes } from "../types/message";
import { IListModel } from "../types/models";
import { ConversationModel } from "./conversation";
import { RoomModel } from "./room";
import { UserModel } from "./user";

export class MessageModel extends Model implements IMessage {
  declare id: number;
  declare content: string;

  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;
  declare readonly deletedAt?: Date;

  declare author?: NonAttribute<UserModel>;
  declare room?: NonAttribute<RoomModel>;
  declare conversation?: NonAttribute<ConversationModel>;

  declare getAuthor: HasOneGetAssociationMixin<UserModel>;
  declare setAuthor: HasOneSetAssociationMixin<UserModel, number>;

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
        validate: {
          notEmpty: {
            msg: "Votre message ne peut pas être vide",
          },
          len: {
            args: [0, 255],
            msg: "Votre message ne peut pas dépasser 255 caractères",
          },
        },
        allowNull: false,
      },
    },
    {
      tableName: "message",
      paranoid: true,
      sequelize,
      validate: {
        bothRoomAndConversation() {
          if (this.roomId && this.conversationId) {
            throw new Error(
              "Les messages ne peuvent être dans une conversation et un salon en même temps"
            );
          }
        },

        eitherRoomOrConversation() {
          if (!this.roomId && !this.conversationId) {
            throw new Error(
              "Les messages doivent être dans une conversation ou un salon"
            );
          }
        },
      },
      defaultScope: {
        attributes: {
          exclude: ["deletedAt"],
        },
        include: "author",
        order: [["createdAt", "ASC"]],
      },
      hooks: {
        // @see {@link https://github.com/sequelize/sequelize/issues/3807#issuecomment-438237173}
        afterCreate: async (message) => {
          await message.reload();
        },
      },
    }
  );

  MessageModel.associate = (models: IListModel) => {
    MessageModel.belongsTo(models.User, {
      as: "author",
      foreignKey: {
        name: "authorId",
        allowNull: false,
      },
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
    const rooms = await models.Room.findAll();
    const conversations = await models.Conversation.findAll();

    const roomsMessagesPromises = rooms.map(async (room) => {
      const users = await room.getUsers();

      if (!users.length) return null;

      const messages: MessageCreationAttributes[] = Array.from(
        { length: faker.datatype.number({ min: 5, max: 10 }) },
        () => ({
          content: faker.lorem.sentence(),
        })
      );

      return Promise.all(
        messages.map(async (message) => {
          const randomUser = faker.helpers.arrayElement(users);

          return models.Message.create({
            ...message,
            roomId: room.id,
            authorId: randomUser.id,
          });
        })
      );
    });

    const conversationsMessagesPromises = conversations.map(
      async (conversation) => {
        const users = await Promise.all([
          conversation.getReceiver(),
          conversation.getSender(),
        ]);

        const messages: MessageCreationAttributes[] = Array.from(
          { length: faker.datatype.number({ min: 1, max: 5 }) },
          () => ({
            content: faker.lorem.sentence(),
          })
        );

        return Promise.all(
          messages.map(async (message) => {
            const randomUser = faker.helpers.arrayElement(users);

            return models.Message.create({
              ...message,
              conversationId: conversation.id,
              authorId: randomUser.id,
            });
          })
        );
      }
    );

    await Promise.all([
      ...roomsMessagesPromises,
      ...conversationsMessagesPromises,
    ]);
  };

  return MessageModel;
};

export default Message;

