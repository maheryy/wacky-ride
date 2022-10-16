import { config } from "dotenv";
config();
import sequelize, { db } from "./sequelize";

(async () => {
  try {
    await sequelize.authenticate();

    Object.values(db).forEach((model) => {
      if (model.associate) {
        model.associate(db);
      }
    });

    await sequelize.sync({ force: true, alter: true });
    console.log("[database]: Database synced successfully.");
  } catch (error) {
    console.error("[database]: Unable to sync the database:", error);
  } finally {
    sequelize.close();
  }
})();
