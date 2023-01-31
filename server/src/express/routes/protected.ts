import { Router } from "express";
import ChatbotRouter from "./chatbot";

const router: Router = Router();

router.use("/workflow", ChatbotRouter);

export default router;
