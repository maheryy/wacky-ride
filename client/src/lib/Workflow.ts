import axios from "axios";
import { Step, WorkflowPayload, WorkflowResponse } from "../types/workflow";

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
    try {
      const response = await axios.post<WorkflowResponse>(this.path, {
        params,
      });
      return response.data.next;
    } catch (error) {
      return null;
    }
  }

  async fetchStep(path: string): Promise<Step | null> {
    this.path = path;
    try {
      const response = await axios.get<Step>(this.path);
      return response.data;
    } catch (error) {
      return null;
    }
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
