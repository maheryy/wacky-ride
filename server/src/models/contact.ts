import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import {
  ContactStatus,
  EContactStatus,
  IContact,
  TContactStatus,
} from "../types/contact";
import { IListModel } from "../types/models";
import { IUser } from "../types/user";
import { UserModel } from "./user";

export class ContactModel extends Model implements IContact {
  declare id: number;
  declare status: TContactStatus;

  declare userId: IUser["id"];
  declare user: NonAttribute<UserModel>;

  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;
  declare readonly deletedAt?: Date;

  declare static associate?: (models: IListModel) => void;
  declare static seed?: (models: IListModel) => Promise<void>;
}

const Contact = (sequelize: Sequelize): typeof ContactModel => {
  ContactModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.ENUM(...ContactStatus),
        allowNull: false,
        defaultValue: EContactStatus.pending,
      },
    },
    {
      tableName: "contact",
      paranoid: true,
      sequelize,
    }
  );

  ContactModel.associate = (models: IListModel) => {
    ContactModel.belongsTo(models.User, {
      as: "user",
      foreignKey: "userId",
    });
  };

  return ContactModel;
};

export default Contact;
