import cors from "cors";
import express, { Express } from "express";
import { authentication, isAdmin } from "./middlewares/auth";
import sse from "./middlewares/sse";
import AdminRouter from "./routes/admin";
import ProtectedRouter from "./routes/protected";
import PublicRouter from "./routes/public";

const app: Express = express();

app.use(cors());
app.use(sse());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", PublicRouter, authentication, ProtectedRouter);
app.use("/admin", isAdmin, AdminRouter);

export default app;
