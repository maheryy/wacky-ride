import { NextFunction, Request, Response } from "express";
import { checkToken } from "../lib/jwt";

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
  if (user) {
    //   req.user = await User.findByPk(user.id);
  } else {
    return res.sendStatus(401);
  }
  next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res.sendStatus(401);
  }
  next();
};
