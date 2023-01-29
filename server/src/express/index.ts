import cors from "cors";
import express, { Express } from "express";
import { authenticate, authorize } from "./middlewares/auth";
import sse from "./middlewares/sse";
import AdminRouter from "./routes/admin";
import ProtectedRouter from "./routes/protected";
import PublicRouter from "./routes/public";

const app: Express = express();
const allowedOrigins = ["http://localhost:5173", "https://maheryy.github.io"];

app.use(cors({ origin: allowedOrigins }));
app.use(sse());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", PublicRouter, authenticate, ProtectedRouter);
app.use("/admin", authorize, AdminRouter);

export default app;
