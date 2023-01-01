import { getOrCreateConversation } from "../../../../services/conversation.service";
import { createMessage } from "../../../../services/message.service";
import { IMessage } from "../../../../types/message";
import { IUser } from "../../../../types/user";
import {
  IConversationEmitEvents,
  TConversationIO,
  TConversationSocket,
} from "../../../@types/main";
import { withErrorHandling } from "../../../helpers/withErrorHandling";

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

    const [conversation] = await getOrCreateConversation(
      socket.data.user.id,
      receiverId
    );

    const message = await createMessage({
      conversationId: conversation.id,
      authorId: socket.data.user.id,
      content,
    });

    const result = { data: { message } };

    socket.emit("conversation:message:received", result);

    io.to(`user:${receiverId}`).emit("conversation:message:received", result);
  }

  socket.on(
    "conversation:message:send",
    handle(onMessage, "conversation:message:received")
  );
};

export default registerConversationHandlers;
