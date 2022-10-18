import {
  Sequelize,
  DataTypes,
  Model,
  UpdateOptions,
  NonAttribute,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManySetAssociationsMixin,
  HasManyRemoveAssociationsMixin,
  HasManyHasAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyRemoveAssociationMixin,
  HasManyAddAssociationsMixin,
} from "sequelize";
import bcrypt from "bcrypt";
import { MessageModel } from "./message";
import { ConversationModel } from "./conversation";
import { RoomModel } from "./room";

export class UserModel extends Model {
  declare id: number;
  declare username: string;
  declare email: string;
  declare password: string;
  declare status: number;
  declare isAdmin: boolean;

  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;

  declare messages?: NonAttribute<MessageModel[]>;
  declare customerConversations?: NonAttribute<ConversationModel[]>;
  declare advisorConversations?: NonAttribute<ConversationModel[]>;
  declare rooms?: NonAttribute<RoomModel[]>;

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

  declare getRooms: HasManyGetAssociationsMixin<RoomModel>;
  declare addRooms: HasManyAddAssociationsMixin<RoomModel, number>;
  declare addRoom: HasManyAddAssociationMixin<RoomModel, number>;
  declare setRooms: HasManySetAssociationsMixin<RoomModel, number>;
  declare removeRooms: HasManyRemoveAssociationsMixin<RoomModel, number>;
  declare removeRoom: HasManyRemoveAssociationMixin<RoomModel, number>;
  declare hasRooms: HasManyHasAssociationsMixin<RoomModel, number>;
  declare hasRoom: HasManyHasAssociationMixin<RoomModel, number>;
  declare countRoom: HasManyCountAssociationsMixin;
  declare createRoom: HasManyCreateAssociationMixin<RoomModel>;

  declare static associate?: (models: any) => void;
  declare static seed?: () => Promise<any>;
}

const User = (sequelize: Sequelize): typeof UserModel => {
  UserModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 20],
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        defaultValue: 0,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      tableName: "user",
      sequelize,
    }
  );

  UserModel.beforeBulkCreate(async (users: UserModel[]) => {
    const salt = await bcrypt.genSalt(10);
    for (const user of users) {
      user.set(
        "password",
        await bcrypt.hash(user.get("password") as string, salt)
      );
    }
  });

  UserModel.beforeCreate(async (user: UserModel) => {
    const salt = await bcrypt.genSalt(10);
    user.set(
      "password",
      await bcrypt.hash(user.get("password") as string, salt)
    );
  });

  UserModel.beforeUpdate(async (user: UserModel, options: UpdateOptions) => {
    const salt = await bcrypt.genSalt(10);
    if (options.fields?.includes("password")) {
      user.set(
        "password",
        await bcrypt.hash(user.get("password") as string, salt)
      );
    }
  });

  UserModel.associate = (models: any) => {
    UserModel.hasMany(models.Message, {
      as: "messages",
      foreignKey: "userId",
    });
    UserModel.hasMany(models.Conversation, {
      as: "customerConversations",
      foreignKey: "customerId",
    });
    UserModel.hasMany(models.Conversation, {
      as: "advisorConversations",
      foreignKey: "advisorId",
    });
    UserModel.belongsToMany(models.Room, {
      through: "user_room",
      as: "rooms",
      foreignKey: "userId",
    });
  };

  UserModel.seed = async () => {
    return UserModel.bulkCreate([
      {
        username: "admin",
        email: "admin@mail.com",
        password: "admin",
        isAdmin: true,
      },
      {
        username: "user",
        email: "user@mail.com",
        password: "user",
        isAdmin: false,
      },
    ]);
  };

  return UserModel;
};

export default User;
