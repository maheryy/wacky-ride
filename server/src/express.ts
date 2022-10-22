import express, { Express } from "express";
import cors from "cors";
import PublicRouter from "./routes/public";
import ProtectedRouter from "./routes/protected";
import AdminRouter from "./routes/admin";
import sse from "./middlewares/sse";
import { authentication, isAdmin } from "./middlewares/auth";

const app: Express = express();

app.use(cors());
app.use(sse());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", PublicRouter, authentication, ProtectedRouter);
app.use("/admin", isAdmin, AdminRouter);

export default app;