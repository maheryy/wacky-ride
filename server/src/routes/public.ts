import { Request, Response, Router } from "express";
import { getAllUsers } from "../services/user.service";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Wacky Ride live");
});

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
