import { Request, Response, Router } from "express";
import { NotificationPayload, ServerSentEvent } from "../../types/event";

const router: Router = Router();

router.post("/notifications", (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).send("Missing message");
  }

  res.sendEvent<NotificationPayload>(ServerSentEvent.NOTIFICATION, { message });
  res.sendStatus(204);
});

export default router;
