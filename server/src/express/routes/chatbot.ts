import { Request, Response, Router } from "express";
import { CHATBOT_WORKFLOW } from "../../lib/workflow";
import { Step } from "../../types/workflow";

const router: Router = Router();

router.get("/*", async (req: Request, res: Response) => {
  const keys = req.path.split("/").filter((key) => key !== "");
  const step = retrieveStep(keys);
  let payload = null;

  if (!step) {
    return res.status(404).send("Not found");
  }

  if (step.getPayload) {
    payload = await step.getPayload();
  }

  return res.json({
    action: step.action,
    message: step.message,
    ...(payload ? { payload } : {}),
  });
});

router.post("/*", (req: Request, res: Response) => {
  const keys = req.path.split("/").filter((key) => key !== "");
  const step = retrieveStep(keys);

  if (!step || !step.postHandler) {
    return res.status(404).send("Not found");
  }

  const next = step.postHandler(...(req.body.params || []));

  if (next === "quit") {
    return res.json({ next: "workflow/quit" });
  } else if (next === "reset") {
    return res.json({ next: "workflow" });
  }

  return res.json({ next: `workflow/${[...keys, next].join("/")}` });
});

const retrieveStep = (keys: string[]): Step | null => {
  let current: any = CHATBOT_WORKFLOW;
  for (const [index, key] of keys.entries()) {
    if (!current.next[key] && index <= keys.length - 1) {
      return null;
    }

    current = current.next[key];
  }

  return current;
};

export default router;
