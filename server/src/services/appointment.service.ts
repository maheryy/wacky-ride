import { db } from "../database/sequelize";
import { Op } from "sequelize";
import { TAppointmentCreationAttributes } from "../types/appointment";
import { AppointmentModel } from "../models/Appointment";

export function createAppointment(room: TAppointmentCreationAttributes) {
  return db.Appointment.create(room);
}

export function getAppointmentsBetween(
  from: Date,
  to: Date
): Promise<AppointmentModel[]> {
  return db.Appointment.findAll({
    where: {
      meetAt: {
        [Op.and]: {
          [Op.gte]: from,
          [Op.lte]: to,
        },
      },
    },
  });
}
