import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { db } from "./database/sequelize";
import { ioAuthentication } from "./middlewares/auth";
import { MessageModel } from "./models/message";
import {
  createConversation,
  getConversationBetweenUsers,
} from "./services/conversation.service";
import {
  createMessageWithinConversation,
  getMessagesByConversation,
} from "./services/message.service";
import { IFullMessage, IMessage } from "./types/message";
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

  const currentUser: IUser = {
    id: 1,
    username: "admin",
    email: "admin@wacky.com",
    password: "password",
    status: 1,
    isAdmin: true,
  };

  // io.use(ioAuthentication);

  io.on("connection", (socket: Socket) => {
    console.log("[socket.io]: New client connected");

    socket.on(
      "conversation:message:send",
      async (message: Omit<IFullMessage, "id">) => {
        console.log("[socket.io]: conversation:message:send");

        const newMessage = await createMessageWithinConversation(
          message.content,
          message.user.id,
          message.conversation!.id
        );

        io.to(`C-${message.conversation!.id}`).emit(
          "conversation:message:received",
          {
            ...(newMessage as MessageModel).toJSON(),
            user: message.user,
          }
        );
      }
    );

    socket.on("conversation:open", async (userId: number) => {
      console.log("[socket.io]: conversation:open", userId);
      try {
        let conversation = await getConversationBetweenUsers(
          currentUser.id,
          userId
        );
        if (!conversation) {
          conversation = await createConversation(currentUser.id, userId);
        }

        const messages: IFullMessage[] = await getMessagesByConversation(
          conversation.id
        );

        socket.join(`C-${conversation.id}`);
        socket.emit("conversation:load", conversation, messages);
      } catch (e: any) {
        console.error(e.message);
      }
    });

    socket.on("conversation:close", async (userId: number) => {
      console.log("[socket.io]: conversation:close", userId);
    });

    socket.on("room:join", (roomId?: number) => {
      console.log("[socket.io]: room:join", roomId);
    });

    socket.on("room:leave", (roomId: number) => {
      console.log("[socket.io]: room:leave", roomId);
    });

    socket.on("disconnect", () => {
      console.log("[socket.io]: Client disconnected");
    });
  });

  return io;
};

export default createSocketIOServer;
