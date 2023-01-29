import bcrypt from "bcrypt";
import { Request, Response, Router } from "express";
import { sign, verify } from "../../lib/jwt";
import { getUserByEmail, getUserById } from "../../services/user.service";
import { getBearerToken } from "../../utils/auth";

const router = Router();

router.post("/login", async (request: Request, response: Response) => {
  const { email, password } = request.body;

  const user = await getUserByEmail(email);

  if (!user) {
    return response.sendStatus(401);
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    return response.sendStatus(401);
  }

  const token = sign(user.id);

  return response.json({ token });
});

router.get("/me", async (request: Request, response: Response) => {
  const token = getBearerToken(request);

  if (!token) {
    return response.sendStatus(401);
  }

  const payload = await verify(token);

  if (!payload) {
    return response.sendStatus(401);
  }

  const user = await getUserById(payload.userId);

  if (!user) {
    return response.sendStatus(401);
  }

  return response.json({ user });
});

export default router;
