import { Router, Request, Response } from "express";
import { db } from "../database/sequelize";

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
    const users = await db.User.findAll();

    const message = {
      content: "Hello World",
    };

    users.forEach(async (user) => {
      const msg = await db.Message.create({
        ...message,
      });

      msg.setUser(user);
      msg.setRoom(1);
    });

    res.json(await db.User.findAll());
  } catch (error: any) {
    console.error(error);
    res.send(error.message as string);
  }
});

export default router;
