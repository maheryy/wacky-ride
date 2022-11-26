import { Request, Response, Router } from "express";

const router: Router = Router();

router.get("/test", (_req: Request, res: Response) => {
  res.send("Testing /admin/test");
});

export default router;
