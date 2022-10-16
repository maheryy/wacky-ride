import { config } from "dotenv";
config();
import sequelize, { db } from "./sequelize";

(async () => {
  try {
    await sequelize.authenticate();

    await Promise.all(
      Object.values(db).map((mod) => {
        if (mod.seed) {
          return mod.seed();
        }
      })
    );

    console.log("[database]: Seeding complete.");
  } catch (error) {
    console.error("[database]: Seeding failed:", error);
  } finally {
    sequelize.close();
  }
})();
