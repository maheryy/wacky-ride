import { NextFunction, Request, Response } from "express";
import { verify } from "../../lib/jwt";
import { getUserById } from "../../services/user.service";
import { getBearerToken } from "../../utils/auth";

/**
 * Authenticates the user and adds it to the request.
 *
 * @example app.use("/protected", authenticate, ProtectedRouter);
 */
export async function authenticate(
  request: Request,
  response: Response,
  next: NextFunction
) {
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

  request.user = user;

  return next();
}

/**
 * Authorizes the admin to access the next middlewares.
 *
 * @example app.use("/admin", authorize, AdminRouter);
 */
export function authorize(
  { user }: Request,
  response: Response,
  next: NextFunction
) {
  if (!user.isAdmin) {
    return response.sendStatus(403);
  }

  return next();
}
