import { Step, WorkflowActions, WorkflowPayload } from "../types/workflow";

const endStep: Step = {
  action: WorkflowActions.CHOICES,
  message: "Autre chose ?",
  getPayload: () => endChoices,
  postHandler: (...params: any) => (params[0] === "yes" ? "reset" : "quit"),
};

const appointmentStep: Step = {
  action: WorkflowActions.CHOICES,
  message: "Quand souhaitez-vous un rendez-vous ?",
  getPayload: () => dateChoices(),
  postHandler: (...params: any) => "end",
  next: { end: endStep },
};

export const CHATBOT_WORKFLOW: Step = {
  action: WorkflowActions.CHOICES,
  message:
    "Bonjour, je suis Wacky, votre assistant personnel. Comment puis-je vous aider ?",
  getPayload: () => workflowChoices,
  postHandler: (...params: any) => params[0],
  next: {
    check: {
      action: WorkflowActions.DATE,
      message: "L'année de votre moto",
      postHandler: () => "last-check",
      next: {
        "last-check": {
          action: WorkflowActions.DATE,
          message: "Quand avez-vous fait la dernière révision ?",
          postHandler: (...params: any) => {
            return yearDiff(new Date(params[0]), new Date()) >= 1
              ? "more-year"
              : "less-year";
          },
          next: {
            "more-year": { ...appointmentStep },
            "less-year": {
              action: WorkflowActions.NUMBER,
              message:
                "Combien de kilomètres avez-vous parcouru depuis la dernière révision ?",
              postHandler: (...params: any) =>
                params[0] >= 10000 ? "more-km" : "less-km",
              next: {
                "more-km": { ...appointmentStep },
                "less-km": {
                  action: WorkflowActions.BOOLEAN,
                  message: "Souhaitez-vous réviser votre moto ?",
                  postHandler: (...params: any) => params[0],
                  next: {
                    yes: { ...appointmentStep },
                    no: { ...endStep },
                  },
                },
              },
            },
          },
        },
      },
    },
    help: {
      action: WorkflowActions.CHOICES,
      message: "Pour quel type d'usage souhaitez-vous en savoir plus ?",
      getPayload: () => usageChoices,
      postHandler: (...params: any) => params[0],
      next: {
        road: { ...appointmentStep },
        sport: { ...appointmentStep },
        "off-road": { ...appointmentStep },
      },
    },
    contact: {
      action: WorkflowActions.CHOICES,
      message: "Quel type d'information souhaitez-vous ?",
      getPayload: () => contactChoices,
      postHandler: (...params: any) => params[0],
      next: {
        phone: {
          ...endStep,
          message:
            "Le numéro de téléphone est le 01 23 45 67 89.\n Autre chose ?",
        },
        email: {
          ...endStep,
          message: "L'adresse email est wacky@contact.com.\n Autre chose ?",
        },
      },
    },
    quit: {
      action: WorkflowActions.CHOICES,
      message: "Merci, à bientôt !",
      getPayload: () => [
        { label: "Démarrer une nouvelle convesation", value: "reset" },
      ],
      postHandler: (...params: any) => params[0],
    },
  },
};

const yearDiff = (date1: Date, date2: Date) => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));

  return diffYears;
};

const contactChoices = [
  {
    label: "Une adresse email",
    value: "email",
  },
  {
    label: "Un numéro de téléphone",
    value: "phone",
  },
];

const endChoices: WorkflowPayload[] = [
  {
    label: "Oui j'ai encore besoin d'aide",
    value: "yes",
  },
  {
    label: "Merci, je n'ai plus besoin d'aide",
    value: "no",
  },
];

const usageChoices: WorkflowPayload[] = [
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

const workflowChoices: WorkflowPayload[] = [
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

const dateChoices = (): WorkflowPayload[] => {
  let dates: Date[] = [];
  let availableDates: Date[] = [];

  do {
    dates = getRemaingWeekDays(
      dates.length ? dates[dates.length - 1] : undefined
    );
    // TODO: check if not already booked
    availableDates = dates.filter((day) => true);
  } while (!availableDates.length);

  return toDateChoicesPayload(availableDates);
};

const toDateChoicesPayload = (days: Date[]): WorkflowPayload[] => {
  return days.map((day) => {
    return {
      label: Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(day),
      value: Intl.DateTimeFormat("fr-FR").format(day),
    };
  });
};

const getRemaingWeekDays = (current?: Date): Date[] => {
  const days: Date[] = [];
  let dt = new Date(current || new Date());

  // Go to next sunday if current day is friday or saturday
  if (dt.getDay() >= 5) {
    dt.setDate(dt.getDate() + ((7 - dt.getDay()) % 7));
  }

  while (dt.getDay() < 5) {
    dt.setDate(dt.getDate() + 1);
    days.push(new Date(dt));
  }

  return days;
};
