import { IUser } from "./user";

export enum WorkflowActions {
  BOOLEAN = "boolean",
  DATE = "date",
  NUMBER = "number",
  CHOICES = "choices",
  NONE = "none",
  QUIT = "quit",
  TEXT = "text",
}

export interface Step {
  action: WorkflowActions;
  message: string;
  getPayload?: () => Promise<WorkflowPayload[]>;
  postHandler?: (user: IUser, ...params: Array<any>) => Promise<string>;
  next?: Record<string, Step>;
}

export interface WorkflowPayload {
  label: string;
  value: string | number | boolean;
}
