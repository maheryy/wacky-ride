import { db } from "../database/sequelize";
import { IUser, UserCreationAttributes } from "../types/user";

export const createUser = async (
  user: UserCreationAttributes
): Promise<IUser> => db.User.create(user);

export const getUserById = async (id: number): Promise<IUser | null> =>
  db.User.findByPk(id);

export const getUserByEmail = async (email: string): Promise<IUser | null> =>
  findOneUserBy({ email });

export const getUserByUsername = async (
  username: string
): Promise<IUser | null> => findOneUserBy({ username });

export const getAllUsers = async (): Promise<IUser[]> => findAllUsersBy();

export const getAdvisors = async (): Promise<IUser[]> =>
  findAllUsersBy({ isAdmin: true });

export const getCustomers = async (): Promise<IUser[]> =>
  findAllUsersBy({ isAdmin: false });

const findOneUserBy = async (fields?: Partial<IUser>): Promise<IUser | null> =>
  db.User.findOne({ where: fields });

const findAllUsersBy = async (fields?: Partial<IUser>): Promise<IUser[]> =>
  db.User.findAll({ where: fields });

/**
 * Update the `fields` of the user with the given `id`.
 * @param id The id of the user to update.
 * @param fields The fields to update.
 * @returns The updated user.
 */
export async function updateUser(id: IUser["id"], fields: Partial<IUser>) {
  const [, [user]] = await db.User.update(fields, {
    where: { id },
    returning: true,
  });

  return user;
}
