import { db } from "../database/sequelize";
import { EContactStatus, IContact, TContactWithUser } from "../types/contact";
import { IUser } from "../types/user";

const { Contact } = db;

/**
 * Creates a new contact for the given `userId`
 * @param userId The user's id
 * @returns The created contact
 */
export async function createContact(userId: IUser["id"]) {
  const conversation = await Contact.create({ userId });

  return Contact.scope("withUser").findByPk(
    conversation.id
  ) as Promise<TContactWithUser>;
}

/**
 * Returns the contact with the given `userId`
 * @param userId The user's id
 * @returns The contact
 */
export function getPendingContact(userId: IUser["id"]) {
  return Contact.findOne({
    where: {
      userId,
      status: EContactStatus.pending,
    },
  });
}

/**
 * Returns the contact with the given `contactId`
 * @param contactId The contact's id
 * @returns The contact
 */
export function getContactById(contactId: number) {
  return Contact.findOne({
    where: {
      id: contactId,
    },
  });
}

/**
 * Returns all contacts
 * @returns The contacts
 */
export async function getContacts(page: number) {
  const { rows, count } = await Contact.scope("withUser").findAndCountAll({
    offset: (page - 1) * Contact.limit,
    order: [["createdAt", "DESC"]],
  });

  return {
    contacts: rows as TContactWithUser[],
    count,
    maxPage: Math.ceil(count / Contact.limit),
  };
}

/**
 * Updates the status of the contact with the given `contactId`
 * @param contactId The contact's id
 * @param status The new status
 * @returns The updated contact
 */
export async function updateContactStatus(
  contactId: IContact["id"],
  status: IContact["status"]
) {
  const [, [contact]] = await Contact.update(
    {
      status,
    },
    {
      where: {
        id: contactId,
      },
      returning: true,
    }
  );

  return contact;
}

