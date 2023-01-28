import {
  getContactById,
  getContacts,
  updateContactStatus,
} from "../../../../services/contact.service";
import { createConversation } from "../../../../services/conversation.service";
import { EContactStatus, IContact } from "../../../../types/contact";
import {
  IContactEmitEvents,
  TContactIO,
  TContactSocket,
} from "../../../@types/admin";
import { WackyRideError } from "../../../errors/WackyRideError";
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
    const contact = await getContactById(contactId);

    if (!contact) {
      throw new WackyRideError("Contact not found");
    }

    if (contact.status !== EContactStatus.pending) {
      throw new WackyRideError("Contact is not pending");
    }

    const updatedContact = await updateContactStatus(
      contactId,
      EContactStatus.accepted
    );

    const conversation = await createConversation({
      senderId: socket.data.user.id,
      receiverId: contact.userId,
      isAdvise: true,
    });

    const result = { data: { contact: updatedContact, conversation } };

    io.of("/").to(`user:${contact.userId}`).emit("contact:accepted", result);

    socket.emit("contact:accepted", result);
  }

  /**
   * Updates the status of the contact with the given `contactId` to `refused`.
   *
   * Emits `contact:refused` with the updated contact to the client and the user
   * that created the contact.
   */
  async function onContactRefuse(contactId: IContact["id"]) {
    const contact = await getContactById(contactId);

    if (!contact) {
      throw new WackyRideError("Contact not found");
    }

    if (contact.status !== EContactStatus.pending) {
      throw new WackyRideError("Contact is not pending");
    }

    const updatedContact = await updateContactStatus(
      contactId,
      EContactStatus.refused
    );

    const result = { data: { contact: updatedContact } };

    socket.emit("contact:refused", result);

    io.of("/").to(`user:${contact.userId}`).emit("contact:refused", result);
  }

  async function onContacts(page: number) {
    const data = await getContacts(page);

    socket.emit("contacts", { data });
  }

  socket.on("contact:accept", handle(onContactAccept, "contact:accepted"));
  socket.on("contact:refuse", handle(onContactRefuse, "contact:refused"));
  socket.on("contacts", handle(onContacts, "contacts"));
}

export default registerContactHandlers;

