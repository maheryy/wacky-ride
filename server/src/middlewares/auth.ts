import { NextFunction, Request, Response } from "express";
import { checkToken } from "../lib/jwt";
import { getUserById } from "../services/user.service";
import { Socket } from "../types/socket.io";
import { IUser } from "../types/user";

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.sendStatus(401);
  }
  const [type, token] = header.split(/\s+/);
  if (type !== "Bearer") {
    return res.sendStatus(401);
  }
  const user = await checkToken(token);

  if (!user) {
    return res.sendStatus(401);
  }

  req.user = (await getUserById(user.id)) as IUser;
  next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res.sendStatus(401);
  }
  next();
};

export const ioAuthentication = async (
  socket: Socket,
  next: (err?: any) => void
) => {
  const token = socket.handshake.auth.token as string;
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }
  const user = await checkToken(token);
  if (!user) {
    return next(new Error("Authentication error: Invalid token"));
  }
  socket.request.user = (await getUserById(user.id)) as IUser;
  next();
};
