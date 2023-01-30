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
  getPayload?: () => WorkflowPayload[];
  postHandler?: (...params: Array<unknown>) => string;
  next?: Record<string, Step>;
}

export interface WorkflowPayload {
  label: string;
  value: string | number | boolean;
}