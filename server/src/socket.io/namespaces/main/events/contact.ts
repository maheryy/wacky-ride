import {
  createContact,
  getContactByUserId,
} from "../../../../services/contact.service";
import { EContactStatus } from "../../../../types/contact";
import {
  IContactEmitEvents,
  TContactIO,
  TContactSocket,
} from "../../../@types/main";
import { withErrorHandling } from "../../../helpers/withErrorHandling";

function registerContactHandlers(io: TContactIO, socket: TContactSocket) {
  const handle = withErrorHandling<IContactEmitEvents>(socket);

  /**
   * Creates a new contact for the logged in user unless they already have
   * a contact pending.
   *
   * Emits `contact:created` with the created or existing contact to the
   * client and to the admin namespace.
   */
  async function onContactCreate() {
    const existingContact = await getContactByUserId(socket.request.user.id);

    if (existingContact?.status === EContactStatus.pending) {
      return socket.emit("contact:created", {
        data: { contact: existingContact },
      });
    }

    const newContact = await createContact(socket.request.user.id);

    socket.emit("contact:created", { data: { contact: newContact } });

    io.of("/admin").emit("contact:created", { data: { contact: newContact } });
  }

  socket.on("contact:create", handle(onContactCreate, "contact:created"));
}

export default registerContactHandlers;
