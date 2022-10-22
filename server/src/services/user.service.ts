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
