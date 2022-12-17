import { verify } from "../../lib/jwt";
import { getUserById } from "../../services/user.service";
import { TSocket } from "../@types";

/**
 * Authenticates the user and adds it to the request.
 *
 * @example io.use(authenticate);
 */
export async function authenticate(
  socket: TSocket,
  next: (error?: Error) => void
) {
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
 * Authorizes the admin to access the next middlewares.
 *
 * @example io.use(authorize);
 */
export async function authorize(
  socket: TSocket,
  next: (error?: Error) => void
) {
  const { user } = socket.request;

  if (!user) {
    return next(new Error("Authorization error: No user found"));
  }

  if (!user.isAdmin) {
    return next(new Error("Authorization error: User is not an admin"));
  }

  return next();
}