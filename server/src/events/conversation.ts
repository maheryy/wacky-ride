import { Server } from "socket.io";
import { MessageModel } from "../models/message";
import {
  createConversation,
  getConversationBetweenUsers,
} from "../services/conversation.service";
import {
  createMessageWithinConversation,
} from "../services/message.service";
import { IFullMessage } from "../types/message";
import {
  EmitEvents,
  InterServerEvents,
  ListenEvents,
  Socket,
  SocketData,
} from "../types/socket.io";
import { IUser } from "../types/user";

const currentUser: IUser = {
  id: 1,
  username: "admin",
  email: "admin@wacky.com",
  password: "password",
  status: 1,
  isAdmin: true,
};

const getConversationHandlers = (
  io: Server<ListenEvents, EmitEvents, InterServerEvents, SocketData>,
  socket: Socket
) => {
  const onConversationMessageSend = async (
    message: Omit<IFullMessage, "id">
  ) => {
    console.log("[socket.io]: conversation:message:send");

    const newMessage = await createMessageWithinConversation(
      message.content,
      message.author.id,
      message.conversation!.id
    );

    io.to(`C-${message.conversation!.id}`).emit(
      "conversation:message:received",
      {
        ...(newMessage as MessageModel).toJSON(),
        author: message.author,
      }
    );
  };

  const onConversationOpen = async (receiverId: number) => {
    console.log("[socket.io]: conversation:open", receiverId);
    try {
      let conversation = await getConversationBetweenUsers(
        currentUser.id,
        receiverId
      );
      if (!conversation) {
        conversation = await createConversation(currentUser.id, receiverId);
      }

      socket.join(`C-${conversation.id}`);
      socket.emit(
        "conversation:load",
        conversation,
        conversation.messages ? (conversation.messages as IFullMessage[]) : []
      );
    } catch (e: any) {
      console.error(e.message);
    }
  };

  const onConversationClose = async (conversationId: number) => {
    console.log("[socket.io]: conversation:close", conversationId);
    socket.leave(`C-${conversationId}`);
  };

  return {
    onConversationMessageSend,
    onConversationOpen,
    onConversationClose,
  };
};

export default getConversationHandlers;
