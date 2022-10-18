import { Sequelize, DataTypes, Model, NonAttribute } from "sequelize";
import { MessageModel } from "./message";
import { UserModel } from "./user";

export class ConversationModel extends Model {
  declare id: number;
  declare status: number;

  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;

  declare customer?: NonAttribute<UserModel>;
  declare advisor?: NonAttribute<UserModel>;
  declare messages?: NonAttribute<MessageModel[]>;

  declare static associate?: (models: any) => void;
  declare static seed?: () => Promise<any>;
}

const Conversation = (sequelize: Sequelize): typeof ConversationModel => {
  ConversationModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
    },
    {
      tableName: "conversation",
      sequelize,
    }
  );

  ConversationModel.associate = (models: any) => {
    ConversationModel.belongsTo(models.User, {
      as: "customer",
      foreignKey: "customerId",
    });
    ConversationModel.belongsTo(models.User, {
      as: "advisor",
      foreignKey: "advisorId",
    });
    ConversationModel.hasMany(models.Message, {
      as: "messages",
      foreignKey: "conversationId",
    });
  };

  ConversationModel.seed = async () => {};

  return ConversationModel;
};

export default Conversation;
