import {
  endConversation,
  getConversation,
  swapSenderAndReceiver,
} from "../../../../services/conversation.service";
import { IConversation } from "../../../../types/conversation";
import {
  IConversationEmitEvents,
  TConversationIO,
  TConversationSocket,
} from "../../../@types/admin";
import { WackyRideError } from "../../../errors/WackyRideError";
import { withErrorHandling } from "../../../helpers/withErrorHandling";

function registerConversationHandlers(
  io: TConversationIO,
  socket: TConversationSocket
) {
  const handle = withErrorHandling<IConversationEmitEvents>(socket);

  async function onConversationEnd(conversationId: IConversation["id"]) {
    const { id: adminId } = socket.data.user;

    const existingConversation = await getConversation(adminId, conversationId);

    if (!existingConversation) {
      throw new WackyRideError("Conversation not found");
    }

    const conversation = await endConversation(adminId, conversationId);

    io.of("/")
      .to(`user:${conversation.senderId}`)
      .emit("conversation:ended", { data: { conversation } });

    io.of("/")
      .to(`user:${conversation.receiverId}`)
      .emit("conversation:ended", {
        data: { conversation: swapSenderAndReceiver(conversation) },
      });
  }

  socket.on(
    "conversation:end",
    handle(onConversationEnd, "conversation:ended")
  );
}

export default registerConversationHandlers;

