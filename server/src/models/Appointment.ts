import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { IListModel } from "../types/models";
import { IUser } from "../types/user";
import { UserModel } from "./user";

export class AppointmentModel extends Model {
  declare id: number;

  declare userId: IUser["id"];
  declare user: NonAttribute<UserModel>;

  declare readonly meetAt: Date;
  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;

  declare static associate?: (models: IListModel) => void;
  declare static seed?: (models: IListModel) => Promise<void>;
}

const Appointment = (sequelize: Sequelize): typeof AppointmentModel => {
  AppointmentModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      meetAt: {
        type: DataTypes.DATE,
        validate: {
          isDate: true,
        },
      },
    },
    {
      tableName: "appointment",
      sequelize,
    }
  );

  AppointmentModel.associate = (models: IListModel) => {
    AppointmentModel.belongsTo(models.User, {
      as: "user",
      foreignKey: "userId",
    });
  };

  return AppointmentModel;
};

export default Appointment;
