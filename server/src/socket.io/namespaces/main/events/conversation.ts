import {
  createConversation,
  getConversation,
  getConversationByUsers,
  getConversations,
} from "../../../../services/conversation.service";
import { createMessage } from "../../../../services/message.service";
import { getUserById } from "../../../../services/user.service";
import { IConversation } from "../../../../types/conversation";
import { IMessage } from "../../../../types/message";
import { IUser } from "../../../../types/user";
import {
  IConversationEmitEvents,
  TConversationIO,
  TConversationSocket,
} from "../../../@types/main";
import { WackyRideError } from "../../../errors/WackyRideError";
import { withErrorHandling } from "../../../helpers/withErrorHandling";

const registerConversationHandlers = (
  io: TConversationIO,
  socket: TConversationSocket
) => {
  const handle = withErrorHandling<IConversationEmitEvents>(socket);

  async function onMessage(
    conversationId: IConversation["id"],
    content: IMessage["content"]
  ) {
    if (typeof conversationId !== "number") {
      throw new WackyRideError("Identifiant de conversation invalide");
    }

    console.log("[socket.io]: conversation:message:send");

    const { id: authorId } = socket.data.user;

    const conversation = await getConversation(authorId, conversationId);

    if (!conversation) {
      throw new WackyRideError("Conversation non trouvée");
    }

    if (conversation.endedAt) {
      throw new WackyRideError(
        "Conversation terminée, impossible d'envoyer un message"
      );
    }

    const message = await createMessage({
      conversationId,
      authorId,
      content,
    });

    const result = { data: { message } };

    socket.emit("conversation:message:received", result);

    io.to(`user:${conversation.receiver.id}`).emit(
      "conversation:message:received",
      result
    );
  }

  async function onConversation(conversationId: IConversation["id"]) {
    if (typeof conversationId !== "number") {
      throw new WackyRideError("Identifiant de conversation invalide");
    }

    const conversation = await getConversation(
      socket.data.user.id,
      conversationId
    );

    if (!conversation) {
      throw new WackyRideError("Conversation non trouvée");
    }

    socket.emit("conversation", { data: { conversation } });
  }

  async function onConversate(receiverId: IUser["id"]) {
    if (typeof receiverId !== "number") {
      throw new WackyRideError("Identifiant d'utilisateur invalide");
    }

    const receiver = await getUserById(receiverId);

    if (!receiver) {
      throw new WackyRideError("Utilisateur non trouvé");
    }

    if (receiver.isAdmin) {
      throw new WackyRideError(
        "Vous ne pouvez pas converser avec un conseiller"
      );
    }

    const { id: senderId } = socket.data.user;

    const existingConversation = await getConversationByUsers(
      senderId,
      receiverId
    );

    if (!existingConversation) {
      const conversation = await createConversation({
        senderId,
        receiverId,
      });

      return socket.emit("conversation", { data: { conversation } });
    }

    socket.emit("conversation", {
      data: { conversation: existingConversation },
    });
  }

  async function onConversations() {
    const conversations = await getConversations(socket.data.user.id);

    socket.emit("conversations", {
      data: {
        conversations: conversations.map((conversation) =>
          conversation.toJSON()
        ),
      },
    });
  }

  socket.on(
    "conversation:message:send",
    handle(onMessage, "conversation:message:received")
  );

  socket.on("conversation", handle(onConversation, "conversation"));
  socket.on("conversations", handle(onConversations, "conversations"));
  socket.on("conversation:conversate", handle(onConversate, "conversation"));
};

export default registerConversationHandlers;

