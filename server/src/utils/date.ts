import { WorkflowPayload } from "../types/workflow";

export const yearDiff = (date1: Date, date2: Date) => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));

  return diffYears;
};

export const getRemaingWeekDays = (current?: Date): Date[] => {
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

export const toDateChoicesPayload = (days: Date[]): WorkflowPayload[] => {
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

export const localStringToDateTime = (date: string): Date => {
  return new Date(date.split("/").reverse().join("-"));
};
