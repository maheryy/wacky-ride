import { Router, Request, Response } from "express";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Wacky Ride live");
});

router.get("/sse", (req: Request, res: Response) => {
  res.initSSE();
  res.send("SSE live");
});

// router.get("/test", (req: Request, res: Response) => {
//   res.send("Testing /test from public.ts");
// });

export default router;
