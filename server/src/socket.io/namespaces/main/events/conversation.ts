/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MessageModel } from "../../../../models/message";
import {
  createConversation,
  getConversationBetweenUsers,
} from "../../../../services/conversation.service";
import { createMessageWithinConversation } from "../../../../services/message.service";
import { IFullMessage } from "../../../../types/message";
import { IUser } from "../../../../types/user";
import {
  IConversationEmitEvents,
  TConversationIO,
  TConversationSocket,
} from "../../../@types";
import { withErrorHandling } from "../../../helpers/withErrorHandling";

const currentUser: IUser = {
  id: 1,
  username: "admin",
  email: "admin@wacky.com",
  password: "password",
  status: "online",
  isAdmin: true,
};

const registerConversationHandlers = (
  io: TConversationIO,
  socket: TConversationSocket
) => {
  const handle = withErrorHandling<IConversationEmitEvents>(socket);

  async function onMessage(message: Omit<IFullMessage, "id">) {
    console.log("[socket.io]: conversation:message:send");

    const newMessage = await createMessageWithinConversation(
      message.content,
      message.author.id,
      message.conversation!.id
    );

    io.to(`C-${message.conversation!.id}`).emit(
      "conversation:message:received",
      {
        data: {
          message: {
            ...(newMessage as MessageModel).toJSON(),
            author: message.author,
          },
        },
      }
    );
  }

  async function onOpen(receiverId: number) {
    console.log("[socket.io]: conversation:open", receiverId);

    let conversation = await getConversationBetweenUsers(
      currentUser.id,
      receiverId
    );

    if (!conversation) {
      conversation = await createConversation(currentUser.id, receiverId);
    }

    socket.join(`C-${conversation.id}`);

    socket.emit("conversation:load", {
      data: {
        conversation,
        messages: conversation.messages
          ? (conversation.messages as IFullMessage[])
          : [],
      },
    });
  }

  async function onClose(conversationId: number) {
    console.log("[socket.io]: conversation:close", conversationId);

    socket.leave(`C-${conversationId}`);
  }

  socket.on(
    "conversation:message:send",
    handle(onMessage, "conversation:message:received")
  );
  socket.on("conversation:open", handle(onOpen, "conversation:load"));
  socket.on("conversation:close", onClose);
};

export default registerConversationHandlers;
