import cors from "cors";
import express, { Express } from "express";
import { getAllowedOrigins } from "../config";
import { authenticate, authorize } from "./middlewares/auth";
import sse from "./middlewares/sse";
import AdminRouter from "./routes/admin";
import ProtectedRouter from "./routes/protected";
import PublicRouter from "./routes/public";

const app: Express = express();

app.use(cors({ origin: getAllowedOrigins() }));
app.use(sse());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", PublicRouter, authenticate, ProtectedRouter);
app.use("/admin", authorize, AdminRouter);

export default app;
