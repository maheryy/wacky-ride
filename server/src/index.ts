import "./config";
import { createServer, Server as HttpServer } from "http";
import app from "./express";
import initializeSocketIOServer from "./socket.io";

const port = process.env.PORT || 3000;
const httpServer: HttpServer = createServer(app);

initializeSocketIOServer(httpServer);

httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
