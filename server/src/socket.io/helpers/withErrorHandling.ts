import { ValidationError } from "sequelize";
import { Socket } from "socket.io";
import { EventsMap } from "socket.io/dist/typed-events";
import { WackyRideError } from "../errors/WackyRideError";

type TEventNames<T> = keyof T & string;

/**
 * Returns a function that handles any errors that occur in
 * its `callback` by emitting an `event` with a wacky-ride-error
 * to the `socket`.
 *
 * @param socket The socket to emit the wacky-ride-error to.
 *
 * @example
 *
 * const handle = withErrorHandling(socket);
 *
 * socket.on("user-status:update", handle(onStatusUpdate, "user-status:updated"));
 */
export function withErrorHandling<TEmitEvents extends EventsMap>(
  socket: Socket
) {
  /**
   * Handles any errors that occur in the `callback` by emitting an `event`
   * with a WackyRideError to the {@link socket} in the closure.
   */
  return function <TArgs extends unknown[], TReturn>(
    callback: (...args: TArgs) => TReturn,
    event: TEventNames<TEmitEvents> = "wacky-ride-error"
  ) {
    /**
     * Calls the {@link callback} and handles any errors that occur
     * by emitting an {@link event} with a WackyRideError to the {@link socket}.
     */
    return async function (...args: TArgs) {
      /**
       * Handles the `error` by emitting an {@link event} with a WackyRideError to the {@link socket}.
       */
      function handleError(error: unknown): boolean {
        if (error instanceof ValidationError) {
          return socket.emit(event, WackyRideError.fromValidationError(error));
        }

        if (error instanceof WackyRideError) {
          return socket.emit(event, error);
        }

        return socket.emit(
          event,
          new WackyRideError("An unknown error occurred")
        );
      }

      try {
        const result = callback(...args);

        if (result instanceof Promise) {
          result.catch(handleError);
        }
      } catch (error: unknown) {
        handleError(error);
      }
    };
  };
}
