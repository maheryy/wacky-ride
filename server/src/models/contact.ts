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

  static limit = 10;
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
        validate: {
          isIn: [ContactStatus],
        },
        defaultValue: EContactStatus.pending,
      },
    },
    {
      tableName: "contact",
      paranoid: true,
      sequelize,
      defaultScope: {
        attributes: { exclude: ["deletedAt", "updatedAt"] },
        limit: ContactModel.limit,
      },
    }
  );

  ContactModel.addScope("withUser", {
    include: "user",
    attributes: { exclude: ["deletedAt", "updatedAt"] },
    limit: ContactModel.limit,
  });

  ContactModel.associate = (models: IListModel) => {
    ContactModel.belongsTo(models.User, {
      as: "user",
      foreignKey: "userId",
    });
  };

  ContactModel.seed = async (models: IListModel) => {
    const conversations = await models.Conversation.findAll({
      where: { isAdvise: true },
    });

    await Promise.all(
      conversations.map(async (conversation) => {
        const sender = await conversation.getSender();
        const receiver = await conversation.getReceiver();

        return ContactModel.create({
          userId: !sender.isAdmin ? sender.id : receiver.id,
          status: EContactStatus.accepted,
        });
      })
    );
  };

  return ContactModel;
};

export default Contact;
