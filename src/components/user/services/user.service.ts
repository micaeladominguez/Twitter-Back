import { PrismaClient } from "@prisma/client";
import { User } from "@/components/user/models";
import {
  CreateUserInput,
  UpdateUserInput,
} from "@/components/user/validator/types";
import argon2 from "argon2";
import Prisma from "@/prisma";

export class UserService {
  private static prisma: PrismaClient = new PrismaClient();

  public static async createUser({
    createUserInput,
  }: {
    createUserInput: CreateUserInput;
  }): Promise<User> {
    const hashedPassword = await argon2.hash(createUserInput.password);
    try {
      const user: User = await this.prisma.user.create({
        data: {
          name: createUserInput.name,
          password: hashedPassword,
          email: createUserInput.email,
          phone: createUserInput.phone,
        },
      });
      return user;
    } catch (e) {
      throw Error("The email is already taken");
    }
  }
  public static async updateUser({
    id,
    updateUserInput,
  }: {
    id: string;
    updateUserInput: UpdateUserInput;
  }): Promise<User> {
    const findUser = await this.findUserById({ id: id });
    if (!findUser) throw new Error("user not found");
    const user: User = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateUserInput,
    });
    return user;
  }

  static async findUserByEmail({ email }: { email: string }): Promise<User> {
    const findUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!findUser) throw new Error("user not found");
    return findUser;
  }
  static async findUserById({ id }: { id: string }): Promise<User> {
    const findUser = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!findUser) throw new Error("user not found");
    return findUser;
  }
}
