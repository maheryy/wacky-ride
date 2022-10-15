import { Response } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      test?: string;
    }

    interface Response {
      initSSE: () => void;
      sendEvent: (eventType: string, data: object) => void;
    }
  }
}
