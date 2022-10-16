import { config } from "dotenv";
import path from "path";
import fs from "fs";
config();
import sequelize from "./sequelize";

(async () => {
  try {
    await sequelize.authenticate();

    const modelsDirectory: string = path.join(__dirname, "..", "models");
    const modules = await Promise.all(
      fs
        .readdirSync(modelsDirectory)
        .filter((file) => file.indexOf(".") !== 0 && file.slice(-3) === ".ts")
        .map((file) => import(path.join(modelsDirectory, file)))
    );

    const models = modules.reduce(
      (db, mod) => ({ ...db, [mod.default.name]: mod.default }),
      {}
    );

    modules.forEach((mod) => {
      if (mod.hasOwnProperty("associate")) {
        mod.associate(models);
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
