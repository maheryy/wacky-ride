import { CorsOptions } from "cors";
import { config } from "dotenv";

config();

export const getAllowedOrigins = (): CorsOptions["origin"] => {
  return process.env.APP_ENV === "production"
    ? ["https://maheryy.github.io", "http://localhost:8080"]
    : ["http://localhost:8080"];
};
