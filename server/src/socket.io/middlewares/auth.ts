import { verify } from "../../lib/jwt";
import { getUserWithConversationsAndRooms } from "../../services/user.service";
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
  // TODO: use socket.handshake.auth.token instead
  const token = socket.request.headers.authorization;

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  const payload = await verify(token);

  if (!payload) {
    return next(new Error("Authentication error: Invalid token"));
  }

  const user = await getUserWithConversationsAndRooms(payload.userId);

  if (!user) {
    return next(new Error("Authentication error: User not found"));
  }

  socket.data.user = user;

  return next();
}

/**
 * Authorizes the admin to access the next middlewares.
 *
 * @param isAdmin Whether the user must be an admin or not.
 *
 * @example io.use(authorize());
 */
export function authorize(isAdmin = false) {
  return async (socket: TSocket, next: (error?: Error) => void) => {
    const { user } = socket.data;

    if (!user) {
      return next(new Error("Authorization error: No user found"));
    }

    if (isAdmin && !user.isAdmin) {
      return next(new Error("Authorization error: User is not an admin"));
    }

    return next();
  };
}
