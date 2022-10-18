import { config } from "dotenv";
config();
import sequelize from "./sequelize";

(async () => {
  try {
    await sequelize.authenticate();

    await sequelize.sync({ force: true, alter: true });
    console.log("[database]: Database synced successfully.");
  } catch (error) {
    console.error("[database]: Unable to sync the database:", error);
  } finally {
    sequelize.close();
  }
})();
