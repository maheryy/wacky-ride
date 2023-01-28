import {
  getConversation,
  getConversations, getOrCreateConversation,
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
import {getUserById} from "../../../../services/user.service";
import {IUser} from "../../../../types/user";

const registerConversationHandlers = (
  io: TConversationIO,
  socket: TConversationSocket
) => {
  const handle = withErrorHandling<IConversationEmitEvents>(socket);

  async function onMessage(
      receiverId: IUser["id"],
    content: IMessage["content"]
  ) {
    console.log("[socket.io]: conversation:message:send");

    const { id: authorId } = socket.data.user;

    const conversation = await getConversation(authorId, receiverId);

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

    const result = {  data: { message } };

    socket.emit("conversation:message:received", result);

    io.to(`user:${conversation.receiver.id}`).emit(
      "conversation:message:received",
      result
    );
  }

  async function onConversation(receiverId: IUser["id"]) {
    const receiver = await getUserById(receiverId);

    if(!receiver){
      throw new WackyRideError("User not found");
    }

    if (receiver.isAdmin){
      throw new WackyRideError("You can't create conversation with admin");
    }

    const conversation = await getOrCreateConversation({
      senderId: socket.data.user.id,
      receiverId,
    });

    const result = { data: { conversation } }

    socket.emit("conversation", result );
    socket.to(`user:${receiverId}`).emit("conversation", result);
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

