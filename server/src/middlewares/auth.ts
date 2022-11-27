import { NextFunction, Request, Response } from "express";
import { verify } from "../lib/jwt";
import { getUserById } from "../services/user.service";
import { TSocket } from "../types/socket.io";

/**
 * Ensures that the user is authenticated.
 *
 * Adds the user to the request.
 *
 * **This middleware is written for Express.**
 *
 * @example app.use("/protected", authentication.express, ProtectedRouter);
 */
async function express(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { authorization } = request.headers;

  if (!authorization) {
    return response.sendStatus(401);
  }

  const [type, token] = authorization.split(/\s+/);

  if (type !== "Bearer") {
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
 * Ensures that the user is an admin.
 *
 * **This middleware is written for Express.**
 *
 * @example app.use("/admin", authorization.admin, AdminRouter);
 */
function admin({ user }: Request, response: Response, next: NextFunction) {
  if (!user) {
    return response.sendStatus(401);
  }

  if (!user.isAdmin) {
    return response.sendStatus(403);
  }

  return next();
}

/**
 * Ensures that the user is authenticated.
 *
 * **This middleware is used for Socket.IO.**
 *
 * @example io.use(authentication.socketIO);
 */
async function socketIO(socket: TSocket, next: (error?: Error) => void) {
  const { token } = socket.handshake.auth;

  console.log("auth", socket.handshake.auth);

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  const payload = await verify(token);

  if (!payload) {
    return next(new Error("Authentication error: Invalid token"));
  }

  const user = await getUserById(payload.userId);

  if (!user) {
    return next(new Error("Authentication error: User not found"));
  }

  socket.request.user = user;

  return next();
}

/**
 * Regroups all the authentication middlewares.
 *
 * @example
 * // For Express:
 * app.use("/protected", authentication.express, ProtectedRouter);
 *
 * // For Socket.IO:
 * io.use(authentication.socketIO);
 */
export const authentication = {
  /**
   * Ensures that the user is authenticated.
   *
   * Adds the user to the request.
   *
   * **This middleware is written for Express.**
   *
   * @example app.use("/protected", authentication.express, ProtectedRouter);
   */
  express,

  /**
   * Ensures that the user is authenticated.
   *
   * **This middleware is used for Socket.IO.**
   *
   * @example io.use(authentication.socketIO);
   */
  socketIO,
};

/**
 * Regroups all the authorization middlewares.
 *
 * @example
 * // For Express:
 * app.use("/admin", authorization.admin, AdminRouter);
 *
 */
export const authorization = {
  /**
   * Ensures that the user is an admin.
   *
   * **This middleware is written for Express.**
   *
   * @example app.use("/admin", authorization.admin, AdminRouter);
   */
  admin,
};
