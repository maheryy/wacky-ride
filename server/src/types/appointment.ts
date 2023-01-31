import { Optional } from "sequelize";
import { IUser } from "./user";

export interface IAppointment {
  id: number;
  userId: IUser["id"];
  meetAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TAppointmentCreationAttributes = Optional<IAppointment, "id">;
