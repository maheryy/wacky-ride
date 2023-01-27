import {
  getConversation,
  getConversations,
} from "../../../../services/conversation.service";
import { createMessage } from "../../../../services/message.service";
import { IConversation } from "../../../../types/conversation";
import { IMessage } from "../../../../types/message";
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
    console.log("[socket.io]: conversation:message:send");

    const { id: authorId } = socket.data.user;

    const conversation = await getConversation(authorId, conversationId);

    if (!conversation) {
      throw new WackyRideError("Conversation not found");
    }

    if (conversation.endedAt) {
      throw new WackyRideError("Conversation has ended");
    }

    const message = await createMessage({
      conversationId: conversation.id,
      authorId,
      content,
    });

    const data = { message };

    socket.emit("conversation:message:received", { data });

    io.to(`user:${conversation.receiver.id}`).emit(
      "conversation:message:received",
      { data }
    );
  }

  async function onConversation(conversationId: IConversation["id"]) {
    const conversation = await getConversation(
      socket.data.user.id,
      conversationId
    );

    if (!conversation) {
      throw new WackyRideError("Conversation not found");
    }

    socket.emit("conversation", { data: { conversation } });
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
};

export default registerConversationHandlers;

