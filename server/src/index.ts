import { config } from "dotenv";
config();
import { createServer, Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import app from "./express";
import createSocketIOServer from "./socket.io";

const port = process.env.PORT || 8080;
const httpServer: HttpServer = createServer(app);
const io: SocketIOServer = createSocketIOServer(httpServer);

httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
