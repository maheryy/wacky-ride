import { Router, Request, Response } from "express";

const router: Router = Router();

router.get("/test", (req: Request, res: Response) => {
  res.send("Testing /admin/test");
});

export default router;
