import { Step, WorkflowPayload } from "../types/workflow";

export default class Workflow {
  declare path: string;
  declare current: Step;
  declare payload: WorkflowPayload;

  async init(): Promise<boolean> {
    const initialStep = await this.fetchStep("workflow");

    if (!initialStep) {
      return false;
    }
    this.current = initialStep;
    return true;
  }

  async next(params: Array<string | boolean | number>): Promise<boolean> {
    const next = await this.requestNext(params);
    if (!next) {
      return false;
    }
    const nextStep = await this.fetchStep(next);
    if (!nextStep) {
      return false;
    }
    this.current = nextStep;
    return true;
  }

  async requestNext(
    params: Array<string | boolean | number>
  ): Promise<string | null> {
    const res = await fetch(`http://localhost:3000/${this.path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ params }),
    });
    if (!res.ok) {
      return null;
    }
    const json = await res.json();
    return json.next;
  }

  async fetchStep(path: string): Promise<Step | null> {
    this.path = path;
    const res = await fetch(`http://localhost:3000/${this.path}`);

    if (!res.ok) {
      return null;
    }

    const step = await res.json();
    return {
      action: step.action,
      message: step.message,
      ...(step.payload ? { payload: step.payload } : {}),
    };
  }

  getActionPayload() {
    return this.current.payload;
  }

  hasActionPayload() {
    return this.current.payload ? true : false;
  }

  getActionType() {
    return this.current.action;
  }

  getMessage() {
    return this.current.message;
  }
}
