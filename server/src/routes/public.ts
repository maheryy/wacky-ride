import { Router, Request, Response } from "express";
import User from "../models/user";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Wacky Ride live");
});

router.get("/sse", (req: Request, res: Response) => {
  res.initSSE();
  res.send("SSE live");
});

router.get("/test", async (req: Request, res: Response) => {
  res.json(await User.findAll());
});

export default router;
