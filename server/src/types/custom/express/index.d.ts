import { Response } from "express";

declare global {
  namespace Express {
    interface Response {
      initSSE: () => void;
      sendEvent: (eventType: string, data: object) => void;
    }
  }
}
