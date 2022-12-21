import { updateContactStatus } from "../../../../services/contact.service";
import { createConversation } from "../../../../services/conversation.service";
import { EContactStatus, IContact } from "../../../../types/contact";
import {
  IContactEmitEvents,
  TContactIO,
  TContactSocket,
} from "../../../@types/admin";
import { TResultWithData } from "../../../@types/result";
import { WackyRideError } from "../../../errors/WackyRideError";
import { withErrorHandling } from "../../../helpers/withErrorHandling";

function registerContactHandlers(io: TContactIO, socket: TContactSocket) {
  const handle = withErrorHandling<IContactEmitEvents>(socket);

  async function onContactCreated({
    data,
  }: TResultWithData<{ contact: IContact }>) {
    socket.broadcast.emit("contact:created", { data });
  }

  /**
   * Updates the status of the contact with the given `contactId` to `accepted`
   * and creates a new conversation between the client and the user that created
   * the contact.
   *
   * Emits `contact:accepted` with the updated contact and the created
   * conversation to the client and the user that created the contact.
   */
  async function onContactAccept(contactId: IContact["id"]) {
    if (!socket.request.user) {
      throw new WackyRideError("User not found");
    }

    const contact = await updateContactStatus(
      contactId,
      EContactStatus.accepted
    );

    const conversation = await createConversation(
      socket.request.user.id,
      contact.userId
    );

    io.of("/")
      .to(`U-${contact.userId}`)
      .emit("contact:accepted", { data: { contact, conversation } });

    socket.emit("contact:accepted", { data: { contact, conversation } });
  }

  /**
   * Updates the status of the contact with the given `contactId` to `refused`.
   *
   * Emits `contact:refused` with the updated contact to the client and the user
   * that created the contact.
   */
  async function onContactRefuse(contactId: IContact["id"]) {
    const contact = await updateContactStatus(
      contactId,
      EContactStatus.refused
    );

    socket.emit("contact:refused", { data: { contact } });

    io.of("/")
      .to(`U-${contact.userId}`)
      .emit("contact:refused", { data: { contact } });
  }

  socket.on("contact:created", handle(onContactCreated, "contact:created"));
  socket.on("contact:accept", handle(onContactAccept, "contact:accepted"));
  socket.on("contact:refuse", handle(onContactRefuse, "contact:refused"));
}

export default registerContactHandlers;
