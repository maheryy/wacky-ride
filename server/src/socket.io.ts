import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { ioAuthentication } from "./middlewares/auth";
import {
  ListenEvents,
  InterServerEvents,
  EmitEvents,
  SocketData,
  Socket,
} from "./types/socket.io";

const createSocketIOServer = (baseServer: HttpServer): Server => {
  const io: Server = new Server<
    ListenEvents,
    EmitEvents,
    InterServerEvents,
    SocketData
  >(baseServer);

  io.use(ioAuthentication);

  io.on("connection", (socket: Socket) => {
    console.log("[socket.io]: New client connected");

    socket.on("disconnect", () => {
      console.log("[socket.io]: Client disconnected");
    });
  });

  return io;
};

export default createSocketIOServer;
