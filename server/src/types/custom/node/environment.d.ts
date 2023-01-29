export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      DB_URI: string;
      JWT_SECRET: string;
      APP_ENV?: "development" | "production";
    }
  }
}
