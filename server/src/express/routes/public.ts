import { Request, Response, Router } from "express";
import AuthRouter from "./auth";
import ChatbotRouter from "./chatbot";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Wacky Ride live");
});

router.use("/workflow", ChatbotRouter);

router.use("/auth", AuthRouter);

router.get("/sse", (req: Request, res: Response) => {
  res.initSSE();
});

export default router;
