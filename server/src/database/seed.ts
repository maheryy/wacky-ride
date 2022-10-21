import { config } from "dotenv";
import { Model } from "sequelize";
import { UserModel } from "../models/user";
import { DatabaseModel, IListModel } from "../types/models";
config();
import sequelize, { db } from "./sequelize";

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true, alter: true });

    for (const model of Object.values(db) as DatabaseModel[]) {
      model.seed && (await model.seed(db));
    }

    console.log("[database]: Seeding complete.");
  } catch (error) {
    console.error("[database]: Seeding failed:", error);
  } finally {
    sequelize.close();
  }
})();
