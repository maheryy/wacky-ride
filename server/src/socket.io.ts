import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import registerConversationHandlers from "./events/conversation";
import registerRoomHandlers from "./events/room";
import registerAdminNamespace from "./namespaces/admin";
import { TSocket } from "./types/socket.io";

function initializeSocketIOServer(httpServer: HttpServer): void {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  registerAdminNamespace(io);

  function onConnection(socket: TSocket) {
    console.log("[socket.io]: New client connected");

    registerConversationHandlers(io, socket);
    registerRoomHandlers(io, socket);

    function onDisconnect() {
      console.log("[socket.io]: Client disconnected");
    }

    socket.on("disconnect", onDisconnect);
  }

  io.on("connection", onConnection);
}

export default initializeSocketIOServer;
