import { Sequelize, DataTypes, Model, NonAttribute } from "sequelize";
import { MessageModel } from "./message";
import { UserModel } from "./user";

export class RoomModel extends Model {
  declare id: number;
  declare name: string;
  declare limit: number;
  declare status: number;

  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;

  declare users?: NonAttribute<UserModel>;
  declare messages?: NonAttribute<MessageModel>;

  declare static associate?: (models: any) => void;
  declare static seed?: () => Promise<any>;
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
        validate: {
          len: [2, 50],
        },
      },
      limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 50,
      },
      status: {
        type: DataTypes.SMALLINT,
        defaultValue: 0,
      },
    },
    {
      tableName: "room",
      sequelize,
    }
  );

  RoomModel.associate = (models: any) => {
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

  RoomModel.seed = async () => {
    return RoomModel.bulkCreate([
      {
        name: "Room 1",
        limit: 25,
      },
      {
        name: "Room 2",
        limit: 45,
      },
      {
        name: "Room 3",
        limit: 50,
      },
    ]);
  };

  return RoomModel;
};

export default Room;
