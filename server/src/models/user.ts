import {
  Sequelize,
  DataTypes,
  Model,
  Optional,
  UpdateOptions,
} from "sequelize";
import bcrypt from "bcrypt";
import { IUser } from "../types/user";

export type UserCreationAttributes = Optional<
  IUser,
  "id" | "isAdmin" | "status"
>;

class UserModel extends Model<IUser, UserCreationAttributes> implements IUser {
  declare id: number;
  declare username: string;
  declare email: string;
  declare password: string;
  declare status: number;
  declare isAdmin: boolean;

  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;

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

  UserModel.associate = (models: any) => {};

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
