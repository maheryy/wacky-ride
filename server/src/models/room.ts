import { faker } from "@faker-js/faker";
import {
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import { IListModel } from "../types/models";
import { TRoomCreationAttributes } from "../types/room";
import { MessageModel } from "./message";
import { UserModel } from "./user";

export class RoomModel extends Model {
  declare id: number;
  declare name: string;
  declare limit: number;

  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;
  declare readonly deletedAt?: Date;

  declare users?: NonAttribute<UserModel[]>;
  declare messages?: NonAttribute<MessageModel[]>;

  declare getUsers: HasManyGetAssociationsMixin<UserModel>;
  declare addUsers: HasManyAddAssociationsMixin<UserModel, number>;
  declare addUser: HasManyAddAssociationMixin<UserModel, number>;
  declare setUsers: HasManySetAssociationsMixin<UserModel, number>;
  declare removeUsers: HasManyRemoveAssociationsMixin<UserModel, number>;
  declare removeUser: HasManyRemoveAssociationMixin<MessageModel, number>;
  declare hasUsers: HasManyHasAssociationsMixin<UserModel, number>;
  declare hasUser: HasManyHasAssociationMixin<UserModel, number>;
  declare countUsers: HasManyCountAssociationsMixin;
  declare createUser: HasManyCreateAssociationMixin<UserModel>;

  declare getMessages: HasManyGetAssociationsMixin<MessageModel>;
  declare addMessages: HasManyAddAssociationsMixin<MessageModel, number>;
  declare addMessage: HasManyAddAssociationMixin<MessageModel, number>;
  declare setMessages: HasManySetAssociationsMixin<MessageModel, number>;
  declare removeMessages: HasManyRemoveAssociationsMixin<MessageModel, number>;
  declare removeMessage: HasManyRemoveAssociationMixin<MessageModel, number>;
  declare hasMessages: HasManyHasAssociationsMixin<MessageModel, number>;
  declare hasMessage: HasManyHasAssociationMixin<MessageModel, number>;
  declare countMessages: HasManyCountAssociationsMixin;
  declare createMessage: HasManyCreateAssociationMixin<MessageModel>;

  declare static associate?: (models: IListModel) => void;
  declare static seed?: (models: IListModel) => Promise<void>;
}

const Room = (sequelize: Sequelize): typeof RoomModel => {
  RoomModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [2, 50],
            msg: "Invalid name, length must be between 2 and 50",
          },
        },
      },
      limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 50,
        validate: {
          min: {
            args: [2],
            msg: "Invalid limit, must at least 2",
          },
          max: {
            args: [50],
            msg: "Invalid limit, must be less than 50",
          },
        },
      },
    },
    {
      tableName: "room",
      paranoid: true,
      sequelize,
      defaultScope: {
        attributes: {
          exclude: ["deletedAt", "updatedAt"],
        },
      },
    }
  );

  RoomModel.addScope("withDeletedAt", {
    attributes: {
      exclude: ["updatedAt"],
    },
  });

  RoomModel.addScope("withUsers", {
    attributes: {
      exclude: ["deletedAt", "updatedAt"],
    },
    include: "users",
  });

  RoomModel.addScope("withMessages", {
    attributes: {
      exclude: ["deletedAt", "updatedAt"],
    },
    include: {
      association: "messages",
      order: [["createdAt", "DESC"]],
    },
  });

  RoomModel.addScope("withAll", {
    attributes: {
      exclude: ["deletedAt", "updatedAt"],
    },
    include: { all: true },
  });

  RoomModel.associate = (models: IListModel) => {
    RoomModel.belongsToMany(models.User, {
      through: "user_room",
      as: "users",
      foreignKey: "roomId",
    });

    RoomModel.hasMany(models.Message, {
      as: "messages",
      foreignKey: "roomId",
    });
  };

  RoomModel.seed = async (models: IListModel) => {
    const users = await models.User.findAll();
    const rooms: TRoomCreationAttributes[] = Array.from({ length: 5 }, () => ({
      name: `${faker.word.adjective()} ${faker.word.noun()}`,
      limit: faker.datatype.number({ min: 10, max: 50 }),
    }));

    await Promise.all(
      rooms.map(async (room) => {
        const randomUsers = faker.helpers
          .shuffle(users)
          .slice(0, Math.floor(Math.random() * (users.length - 1)));
        const newRoom = await models.Room.create(room);

        return newRoom.setUsers(randomUsers);
      })
    );
  };

  return RoomModel;
};

export default Room;
