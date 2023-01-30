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
  const { token } = socket.handshake.auth;

  if (!token) {
    return next(
      new Error("Erreur d'authentification: Il manque quelque chose là...")
    );
  }

  const payload = await verify(token);

  if (!payload) {
    return next(new Error("Erreur d'authentification: Qui êtes-vous ...?"));
  }

  const user = await getUserWithConversationsAndRooms(payload.userId);

  if (!user) {
    return next(
      new Error(
        "Erreur d'authentification: Il faut croire que vous n'existez pas..."
      )
    );
  }

  socket.data.user = user.toJSON();

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

    /**
     * This should never happen, but TypeScript doesn't know that.
     */

    if (!user) {
      return next(
        new Error("Erreur d'authentification: l'impossible est arrivé")
      );
    }

    if (isAdmin && !user.isAdmin) {
      return next(
        new Error("Erreur d'authentification: Bien essayé, mais non...")
      );
    }

    return next();
  };
}

