import {
  endConversation,
  getConversation,
} from "../../../../services/conversation.service";
import { IUser } from "../../../../types/user";
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

  async function onConversationEnd(receiverId: IUser["id"]) {
    const { id: adminId } = socket.data.user;

    const existingConversation = await getConversation(adminId, receiverId);

    if (!existingConversation) {
      throw new WackyRideError("Conversation not found");
    }

    const conversation = await endConversation(adminId, receiverId);

    const result = { data: { conversation } };

    io.of("/")
      .to(`user:${conversation.senderId}`)
      .emit("conversation:ended", result);

    io.of("/")
      .to(`user:${conversation.receiverId}`)
      .emit("conversation:ended", result);
  }

  socket.on(
    "conversation:end",
    handle(onConversationEnd, "conversation:ended")
  );
}

export default registerConversationHandlers;
