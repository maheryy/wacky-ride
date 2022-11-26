import { JwtPayload, Secret, sign, verify } from "jsonwebtoken";
import { IToken } from "../types/jwt";
import { IUser } from "../types/user";

export const createToken = (user: IUser): string => {
  const payload: IToken = {
    id: user.id,
  };

  return sign(payload, process.env.JWT_SECRET as Secret, {
    expiresIn: "1y",
  });
};

export const checkToken = async (token: string): Promise<IToken | false> => {
  try {
    const decoded = (await verify(
      token,
      process.env.JWT_SECRET as Secret
    )) as JwtPayload;

    return {
      id: decoded.id,
    } as IToken;
  } catch (error) {
    return false;
  }
};
