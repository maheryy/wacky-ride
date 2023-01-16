import { Request } from "express";

export const getBearerToken = (req: Request): string | null => {
  const { authorization } = req.headers;

  if (!authorization) {
    return null;
  }

  const [type, token] = authorization.split(/\s+/);

  if (type !== "Bearer") {
    return null;
  }

  return token;
};
