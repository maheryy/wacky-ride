import bcrypt from "bcrypt";
import { Request, Response, Router } from "express";
import { sign } from "../../lib/jwt";
import { getUserByEmail } from "../../services/user.service";

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

export default router;
