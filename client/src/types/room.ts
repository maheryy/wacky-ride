export interface IRoom {
  id: number;
  name: string;
  limit: number;
  status: number;
  createdAt?: Date;
  updatedAt?: Date;
}