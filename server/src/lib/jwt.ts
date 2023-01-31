import jwt, { Secret } from "jsonwebtoken";
import { IPayload } from "../types/jwt";
import { IUser } from "../types/user";

/**
 * Signs the `userId` into a JWT.
 * @param userId The user's id to sign.
 * @returns The signed JWT.
 *
 * @example
 *
 * const token = sign(user.id);
 */
export function sign(userId: IUser["id"]): string {
  const payload: IPayload = { userId };

  return jwt.sign(payload, <Secret>process.env.JWT_SECRET, {
    expiresIn: "1y",
  });
}

/**
 * Determines if `token` is of type {@link IPayload}.
 */
function isPayload(payload: unknown): payload is IPayload {
  return typeof payload === "object" && payload !== null && "userId" in payload;
}

/**
 * Verifies the `token`.
 * @param token The token to verify.
 * @returns The payload if the token is valid, otherwise `null`.
 *
 * @example const payload = verify(token);
 */
export async function verify(token: string): Promise<IPayload | null> {
  try {
    const payload = jwt.verify(token, <Secret>process.env.JWT_SECRET);

    if (isPayload(payload)) {
      return payload;
    }

    return null;
  } catch (error) {
    return null;
  }
}
