import { updateContactStatus } from "../../../../services/contact.service";
import { createConversation } from "../../../../services/conversation.service";
import { EContactStatus, IContact } from "../../../../types/contact";
import {
  IContactEmitEvents,
  TContactIO,
  TContactSocket,
} from "../../../@types/admin";
import { withErrorHandling } from "../../../helpers/withErrorHandling";

function registerContactHandlers(io: TContactIO, socket: TContactSocket) {
  const handle = withErrorHandling<IContactEmitEvents>(socket);

  /**
   * Updates the status of the contact with the given `contactId` to `accepted`
   * and creates a new conversation between the client and the user that created
   * the contact.
   *
   * Emits `contact:accepted` with the updated contact and the created
   * conversation to the client and the user that created the contact.
   */
  async function onContactAccept(contactId: IContact["id"]) {
    const contact = await updateContactStatus(
      contactId,
      EContactStatus.accepted
    );

    const conversation = await createConversation(
      socket.data.user.id,
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

  socket.on("contact:accept", handle(onContactAccept, "contact:accepted"));
  socket.on("contact:refuse", handle(onContactRefuse, "contact:refused"));
}

export default registerContactHandlers;
