import { DataTypes, Model, ModelDefined, UpdateOptions } from "sequelize";
import { IUser, IUserCreation } from "../types/user";
import sequelize from "../database/sequelize";
import bcrypt from "bcrypt";

const User: ModelDefined<IUser, IUserCreation> = sequelize.define("user", {
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
});

User.beforeBulkCreate(async (users: Model<IUser, IUserCreation>[]) => {
  const salt = await bcrypt.genSalt(10);
  for (const user of users) {
    user.set(
      "password",
      await bcrypt.hash(user.get("password") as string, salt)
    );
  }
});

User.beforeCreate(async (user: Model<IUser, IUserCreation>) => {
  const salt = await bcrypt.genSalt(10);
  user.set("password", await bcrypt.hash(user.get("password") as string, salt));
});

User.beforeUpdate(
  async (user: Model<IUser, IUserCreation>, options: UpdateOptions) => {
    const salt = await bcrypt.genSalt(10);
    if (options.fields?.includes("password")) {
      user.set(
        "password",
        await bcrypt.hash(user.get("password") as string, salt)
      );
    }
  }
);

export const associate = (models: any) => {
  /*
  User.hasMany(models.message, {
    foreignKey: "messageId",
    as: "messages",
  });
  */
};

export const seed = async () => {
  return User.bulkCreate([
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

export default User;
