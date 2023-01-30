import { createAppointment } from "../../services/appointment.service";
import { IUser } from "../../types/user";
import { Step, WorkflowActions } from "../../types/workflow";
import { localStringToDateTime, yearDiff } from "../../utils/date";
import * as Choices from "./choices";

const endStep: Step = {
  action: WorkflowActions.CHOICES,
  message: "Autre chose ?",
  getPayload: Choices.end,
  postHandler: async (_, ...params) => (params[0] === "yes" ? "reset" : "quit"),
};

const appointmentStep: Step = {
  action: WorkflowActions.CHOICES,
  message: "Quand souhaitez-vous un rendez-vous ?",
  getPayload: Choices.date,
  postHandler: async (user: IUser, ...params) => {
    const date = params[0] ? localStringToDateTime(params[0]) : null;
    if (date) {
      date.setHours(2, 0, 0, 0);
      await createAppointment({ meetAt: date, userId: user.id });
    }
    return "end";
  },
  next: {
    end: {
      ...endStep,
      message: "Votre rendez-vous est confirmé. Autre chose ?",
    },
  },
};

export const CHATBOT_WORKFLOW: Step = {
  action: WorkflowActions.CHOICES,
  message:
    "Bonjour, je suis Wacky, votre assistant personnel. Comment puis-je vous aider ?",
  getPayload: Choices.workflow,
  postHandler: async (_, ...params) => params[0],
  next: {
    check: {
      action: WorkflowActions.DATE,
      message: "L'année de votre moto",
      postHandler: async () => "last-check",
      next: {
        "last-check": {
          action: WorkflowActions.DATE,
          message: "Quand avez-vous fait la dernière révision ?",
          postHandler: async (_, ...params) => {
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
              postHandler: async (_, ...params) =>
                params[0] >= 10000 ? "more-km" : "less-km",
              next: {
                "more-km": { ...appointmentStep },
                "less-km": {
                  action: WorkflowActions.BOOLEAN,
                  message: "Souhaitez-vous réviser votre moto ?",
                  postHandler: async (_, ...params) => params[0],
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
      getPayload: Choices.usage,
      postHandler: async (_, ...params) => params[0],
      next: {
        road: { ...appointmentStep },
        sport: { ...appointmentStep },
        "off-road": { ...appointmentStep },
      },
    },
    contact: {
      action: WorkflowActions.CHOICES,
      message: "Quel type d'information souhaitez-vous ?",
      getPayload: Choices.contact,
      postHandler: async (_, ...params) => params[0],
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
      getPayload: Choices.reset,
      postHandler: async (_, ...params) => params[0],
    },
  },
};
