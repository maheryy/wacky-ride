import { Request, Response, Router } from "express";
import AuthRouter from "./auth";

const router: Router = Router();

router.use("/auth", AuthRouter);

router.get("/sse", (req: Request, res: Response) => {
  res.initSSE();
});

export default router;
