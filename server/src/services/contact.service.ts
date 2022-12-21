import { db } from "../database/sequelize";
import { IContact } from "../types/contact";
import { IUser } from "../types/user";

const { Contact } = db;

/**
 * Creates a new contact for the given `userId`
 * @param userId The user's id
 * @returns The created contact
 */
export function createContact(userId: IUser["id"]) {
  return Contact.create({
    userId,
  });
}

/**
 * Returns the contact with the given `userId`
 * @param userId The user's id
 * @returns The contact
 */
export function getContactByUserId(userId: IUser["id"]) {
  return Contact.findOne({
    where: {
      userId,
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
export function getContacts() {
  return Contact.findAll();
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
