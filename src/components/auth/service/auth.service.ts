import argon2 from "argon2";
import {
  decodeUserSessionAccessJWT,
  encodeUserSessionAccessJWT,
} from "@/components/auth/service/user-session-jwt";
import { UserService } from "@/components/user/services/user.service";
export class AuthService {
  public static decodeSessionToken(token: string) {
    const { sub } = decodeUserSessionAccessJWT(token);
    return sub;
  }

  public static encodeUserSessionAccess(userId: string) {
    return encodeUserSessionAccessJWT(userId);
  }
  public static async authenticateUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const user = await UserService.findUserByEmail({ email: email });
    const match = await argon2.verify(user.password, password);
    if (match) {
      const jwt = this.encodeUserSessionAccess(user.id);
      if (user.isActive) {
        return {
          jwt,
          user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            name: user.name,
          },
        };
      } else {
        throw new Error("Invalid login");
      }
    }
    throw new Error("Invalid login");
  }

  public static async validateToken({ jwt }: { jwt: string }) {
    const sub = AuthService.decodeSessionToken(jwt);
    if (!sub) {
      throw new Error("Invalid token");
    }
    return await UserService.findUserById({ id: sub });
  }
}
