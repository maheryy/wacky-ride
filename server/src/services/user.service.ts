import { db } from "../database/sequelize";
import {
  IUser,
  TUserCreationAttributes,
  TUserUpdateAttributes,
  TUserWithConversationsAndRooms,
} from "../types/user";

const { User } = db;

export const createUser = async (
  user: TUserCreationAttributes
): Promise<IUser> => User.create(user);

export const getUserById = async (id: number): Promise<IUser | null> =>
  User.findByPk(id);

export function getUserWithConversationsAndRooms(id: IUser["id"]) {
  return User.scope(["withConversations", "withRooms", "withRole"]).findByPk(
    id
  ) as Promise<TUserWithConversationsAndRooms | null>;
}

export const getUserByEmail = async (email: string): Promise<IUser | null> =>
  findOneUserBy({ email }, "withPassword");

export const getUserByUsername = async (
  username: string
): Promise<IUser | null> => findOneUserBy({ username });

export const getAllUsers = async (): Promise<IUser[]> => findAllUsersBy();

export const getAdvisors = async (): Promise<IUser[]> =>
  findAllUsersBy({ isAdmin: true });

export const getCustomers = async (): Promise<IUser[]> =>
  findAllUsersBy({ isAdmin: false });

const findOneUserBy = async (
  fields?: Partial<IUser>,
  scope?: string
): Promise<IUser | null> => User.scope(scope).findOne({ where: fields });

const findAllUsersBy = async (fields?: Partial<IUser>): Promise<IUser[]> =>
  User.findAll({ where: fields });

/**
 * Update the `fields` of the user with the given `id`.
 * @param id The id of the user to update.
 * @param fields The fields to update.
 * @returns The updated user.
 */
export async function updateUser(
  id: IUser["id"],
  fields: TUserUpdateAttributes
) {
  const [, [user]] = await User.update(fields, {
    where: { id },
    returning: true,
  });

  return user;
}
