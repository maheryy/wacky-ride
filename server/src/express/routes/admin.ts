import { Request, Response, Router } from "express";

const router: Router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.send("🔒 You are an admin");
});

export default router;
