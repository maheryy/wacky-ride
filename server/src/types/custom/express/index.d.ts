/* eslint-disable @typescript-eslint/no-unused-vars */
import { Response } from "express";
import { ServerSentEvent } from "../../event";

declare global {
  namespace Express {
    interface Response {
      initSSE: () => void;
      sendEvent: <T>(eventType: ServerSentEvent, data: T) => void;
    }
  }
}
