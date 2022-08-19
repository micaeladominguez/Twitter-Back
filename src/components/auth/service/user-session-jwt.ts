import jwt from "jsonwebtoken";

export type JWTPayload = {
  sub: string;
  iat: number;
  iss: string;
  exp: number;
};

const ISSUER = "Twitter-api";

const expiresIn = process.env.SESSION_ACCESS_TOKEN_EXPIRES_IN || "365d";
const secret = process.env.SESSION_ACCESS_TOKEN_SECRET || "secret";

export const encodeUserSessionAccessJWT = (userId: string) => {
  return jwt.sign({}, secret, {
    expiresIn,
    issuer: ISSUER,
    subject: userId,
  });
};
export const decodeUserSessionAccessJWT = (token: string) => {
  return jwt.verify(token, secret) as JWTPayload;
};
