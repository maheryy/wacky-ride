import { Sequelize } from "sequelize";
import { getModels } from "./models";

const sequelize: Sequelize = new Sequelize(process.env.DB_URI as string, {
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("[database]: Connection has been established successfully.");
  } catch (error) {
    console.error("[database]: Unable to connect to the database:", error);
  }
})();

export const db = getModels(sequelize);
export default sequelize;
