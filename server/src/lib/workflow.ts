import { WorkflowActions } from "../types/workflow";

const endStep = {
  end: {
    action: WorkflowActions.CHOICES,
    message: "Autre chose ?",
    getPayload: () => endChoices,
    postHandler: (...params: any) => (params[0] === "yes" ? "reset" : "quit"),
  },
};

const appointmentStep = {
  action: WorkflowActions.CHOICES,
  message: "Quand souhaitez-vous un rendez-vous ?",
  getPayload: () => dateChoices,
  postHandler: (...params: any) => "end",
  next: { ...endStep },
};

export const CHATBOT_WORKFLOW = {
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
                    no: { ...endStep.end },
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
          ...endStep.end,
          message:
            "Le numéro de téléphone est le 01 23 45 67 89.\n Autre chose ?",
        },
        email: {
          ...endStep.end,
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

const endChoices = [
  {
    label: "Oui j'ai encore besoin d'aide",
    value: "yes",
  },
  {
    label: "Merci, je n'ai plus besoin d'aide",
    value: "no",
  },
];

const usageChoices = [
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

const workflowChoices = [
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

const dateChoices = [
  {
    label: "Mercredi 10 mars",
    value: "2021-03-10",
  },
  {
    label: "Jeudi 11 mars",
    value: "2021-03-11",
  },
  {
    label: "Vendredi 12 mars",
    value: "2021-03-12",
  },
  {
    label: "Samedi 13 mars",
    value: "2021-03-13",
  },
  {
    label: "Dimanche 14 mars",
    value: "2021-03-14",
  },
];
