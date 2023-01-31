import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { getAllowedOrigins } from "../config";
import { TServer, TSocket } from "./@types";
import { authenticate, authorize } from "./middlewares/auth";
import registerAdminNamespace from "./namespaces/admin";
import registerContactHandlers from "./namespaces/main/events/contact";
import registerConversationHandlers from "./namespaces/main/events/conversation";
import registerRoomHandlers from "./namespaces/main/events/room";
import registerUserHandlers from "./namespaces/main/events/user";

function initializeSocketIOServer(httpServer: HttpServer): void {
  const io: TServer = new SocketIOServer(httpServer, {
    cors: { origin: getAllowedOrigins() },
  });

  io.use(authenticate);

  io.use(authorize());

  registerAdminNamespace(io);

  function onConnection(socket: TSocket) {
    console.log("[socket.io]: New client connected");

    const { user } = socket.data;

    // The user should be authenticated and authorized but TypeScript does not know this.
    if (!user) {
      return;
    }

    socket.join(`user:${user.id}`);

    socket.emit("user:connected", {
      data: { user: { ...user, isAdmin: undefined } },
    });

    registerConversationHandlers(io, socket);
    registerRoomHandlers(io, socket);
    registerContactHandlers(io, socket);
    registerUserHandlers(io, socket);

    function onDisconnect() {
      console.log("[socket.io]: Client disconnected");
    }

    socket.on("disconnect", onDisconnect);
  }

  io.on("connection", onConnection);
}

export default initializeSocketIOServer;
