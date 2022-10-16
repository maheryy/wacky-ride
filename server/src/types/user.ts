export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  status: number;
  createdAt?: Date;
  updatedAt?: Date;
}