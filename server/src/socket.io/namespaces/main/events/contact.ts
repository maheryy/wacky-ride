import {
  createContact,
  getPendingContact,
} from "../../../../services/contact.service";
import { getNotEndedAdvisorConversation } from "../../../../services/conversation.service";
import {
  IContactEmitEvents,
  TContactIO,
  TContactSocket,
} from "../../../@types/main";
import { WackyRideError } from "../../../errors/WackyRideError";
import { isAnyAdminOnline } from "../../../helpers/isAnyAdminOnline";
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
    const isAdminAvailable = await isAnyAdminOnline(io);

    if (!isAdminAvailable) {
      throw new WackyRideError(
        "Aucun conseiller n'est disponible pour le moment, nous vous prions de bien vouloir réessayer ultérieurement"
      );
    }

    const { id: userId } = socket.data.user;

    const pendingContact = await getPendingContact(userId);

    if (pendingContact) {
      return socket.emit("contact:pending", {
        data: { contact: pendingContact },
      });
    }

    const notEndedAdvisorConversation = await getNotEndedAdvisorConversation(
      userId
    );

    if (notEndedAdvisorConversation) {
      throw new WackyRideError("Un conseiller s'occupe déjà de vous");
    }

    const newContact = await createContact(userId);

    socket.emit("contact:created", { data: { contact: newContact } });

    io.of("/admin").emit("contact:created", { data: { contact: newContact } });
  }

  socket.on("contact:create", handle(onContactCreate, "contact:created"));
}

export default registerContactHandlers;

