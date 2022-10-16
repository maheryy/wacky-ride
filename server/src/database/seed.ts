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

    await Promise.all(
      modules
        .filter(async (mod) => mod.hasOwnProperty("seed"))
        .map((mod) => mod.seed())
    );
    console.log("[database]: Seeding complete.");
  } catch (error) {
    console.error("[database]: Seeding failed:", error);
  } finally {
    sequelize.close();
  }
})();
