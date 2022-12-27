import { Request, Response, Router } from "express";
import { getAllUsers } from "../../services/user.service";
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
  res.send("SSE live");
});

router.get("/test", async (req: Request, res: Response) => {
  try {
    res.json(await getAllUsers());
  } catch (error: unknown) {
    console.error(error);

    // TODO: handle the error format
    res.send(error);
  }
});

export default router;
