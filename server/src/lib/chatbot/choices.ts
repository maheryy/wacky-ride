import { getAppointmentsBetween } from "../../services/appointment.service";
import { WorkflowPayload } from "../../types/workflow";
import { getRemaingWeekDays, toDateChoicesPayload } from "../../utils/date";

export const end = async (): Promise<WorkflowPayload[]> => [
  {
    label: "Oui j'ai encore besoin d'aide",
    value: "yes",
  },
  {
    label: "Merci, je n'ai plus besoin d'aide",
    value: "no",
  },
];

export const usage = async (): Promise<WorkflowPayload[]> => [
  {
    label: "Routier",
    value: "road",
  },
  {
    label: "Tout terrain",
    value: "off-road",
  },
  {
    label: "Sportif",
    value: "sport",
  },
];

export const workflow = async (): Promise<WorkflowPayload[]> => [
  {
    label: "Vérifier l'entretien de ma moto",
    value: "check",
  },
  {
    label: "Informations sur les motos",
    value: "help",
  },
  {
    label: "Chercher un contact",
    value: "contact",
  },
  {
    label: "Quitter",
    value: "quit",
  },
];

export const date = async (): Promise<WorkflowPayload[]> => {
  let dates: Date[] = [];
  let availableDates: Date[] = [];

  do {
    dates = getRemaingWeekDays(
      dates.length ? dates[dates.length - 1] : undefined
    );
    const appointments = (
      await getAppointmentsBetween(dates[0], dates[dates.length - 1])
    ).map((appointment) => appointment.meetAt.toDateString());

    availableDates = dates.filter(
      (day) => !appointments.includes(day.toDateString())
    );
  } while (!availableDates.length);

  return toDateChoicesPayload(availableDates);
};

export const contact = async (): Promise<WorkflowPayload[]> => [
  {
    label: "Une adresse email",
    value: "email",
  },
  {
    label: "Un numéro de téléphone",
    value: "phone",
  },
];

export const reset = async (): Promise<WorkflowPayload[]> => [
  { label: "Démarrer une nouvelle convesation", value: "reset" },
];
