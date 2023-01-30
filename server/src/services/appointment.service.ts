import { db } from "../database/sequelize";
import { Op } from "sequelize";
import { TAppointmentCreationAttributes } from "../types/appointment";

export function createAppointment(room: TAppointmentCreationAttributes) {
  return db.Appointment.create(room);
}

export function getAppointmentsBetween(from: Date, to: Date) {
  return db.Appointment.findAll({
    where: {
      meetAt: {
        [Op.between]: [from, to],
      },
    },
  });
}
