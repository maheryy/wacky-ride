import { Request, Response, Router } from "express";

const router: Router = Router();

router.get("/test", (_req: Request, res: Response) => {
  res.send("Testing /test from private.ts");
});

export default router;
