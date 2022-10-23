import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import getConversationHandlers from "./events/conversation";
import getRoomHandlers from "./events/room";
import { ioAuthentication } from "./middlewares/auth";
import {
  ListenEvents,
  InterServerEvents,
  EmitEvents,
  SocketData,
  Socket,
} from "./types/socket.io";
import { IUser } from "./types/user";

const createSocketIOServer = (baseServer: HttpServer): Server => {
  const io: Server = new Server<
    ListenEvents,
    EmitEvents,
    InterServerEvents,
    SocketData
  >(baseServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  // io.use(ioAuthentication);

  io.on("connection", (socket: Socket) => {
    const {
      onConversationMessageSend,
      onConversationOpen,
      onConversationClose,
    } = getConversationHandlers(io, socket);

    const { onRoomMessageSend, onRoomJoin, onRoomLeave } = getRoomHandlers(
      io,
      socket
    );

    console.log("[socket.io]: New client connected");

    socket.on("conversation:message:send", onConversationMessageSend);
    socket.on("conversation:open", onConversationOpen);
    socket.on("conversation:close", onConversationClose);

    socket.on("room:message:send", onRoomMessageSend);
    socket.on("room:join", onRoomJoin);
    socket.on("room:leave", onRoomLeave);

    socket.on("disconnect", () => {
      console.log("[socket.io]: Client disconnected");
    });
  });

  return io;
};

export default createSocketIOServer;
