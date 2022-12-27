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
  postHandler?: (...params: Array<unknown>) => string;
  next?: unknown;
}


export interface WorkflowPayload {
  label: string;
  value: string | number | boolean;
}