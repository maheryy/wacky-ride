import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { TSocket } from "./@types";
import registerAdminNamespace from "./namespaces/admin";
import registerConversationHandlers from "./namespaces/main/events/conversation";
import registerRoomHandlers from "./namespaces/main/events/room";

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
