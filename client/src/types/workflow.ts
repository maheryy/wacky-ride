export enum WorkflowActionTypes {
  BOOLEAN = "boolean",
  DATE = "date",
  NUMBER = "number",
  CHOICES = "choices",
  NONE = "none",
  QUIT = "quit",
  TEXT = "text",
}

export interface WorkflowAction {
  type: WorkflowActionTypes;
  payload?: WorkflowPayload[];
}

export interface WorkflowPayload {
  label: string,
  value: string | number | boolean,
}

export interface Step {
  action: WorkflowActionTypes;
  message: string;
  payload?: WorkflowPayload[];
}

export interface WorkflowResponse {
  next: string;
}