import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import PublicRouter from "./routes/public";
import ProtectedRouter from "./routes/protected";
import AdminRouter from "./routes/admin";
import sse from "./middlewares/sse";
import { authentication, isAdmin } from "./middlewares/auth";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(sse());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", PublicRouter, authentication, ProtectedRouter);
app.use("/admin", isAdmin, AdminRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
