import { PrismaClient } from "@prisma/client";
import { User } from "@/components/user/models";
import {
  CreateUserInput,
  UpdateUserInput,
} from "@/components/user/validator/types";
import argon2 from "argon2";
import Prisma from "@/prisma";
import { UserResponse } from "@/components/user/models/utils/user.entity.response";

export class UserService {
  private static prisma: PrismaClient = new PrismaClient();

  public static async createUser({
    createUserInput,
  }: {
    createUserInput: CreateUserInput;
  }) {
    const hashedPassword = await argon2.hash(createUserInput.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          name: createUserInput.name,
          password: hashedPassword,
          email: createUserInput.email,
          phone: createUserInput.phone,
        },
      });
      const userWithoutPassword = this.exclude(user, "password");
      return userWithoutPassword;
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
  }) {
    const findUser = await this.findUserById({ id: id });
    if (!findUser) throw new Error("user not found");
    const user: User = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateUserInput,
    });
    const userWithoutPassword = this.exclude(user, "password");
    return userWithoutPassword;
  }

  static async allUsers() {
    const users: User[] = await this.prisma.user.findMany();
    const usersWithoutPassword: User[] = [];
    users.forEach((user) => {
      usersWithoutPassword.push(this.exclude(user, "password"));
    });
    return usersWithoutPassword;
  }
  static async findUserByEmail({ email }: { email: string }) {
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
    const userWithoutPassword = this.exclude(findUser, "password");
    return userWithoutPassword;
  }

  static async allUsersLike({ email }: { email: string }) {
    const findUsers = await this.prisma.user.findMany({
      where: {
        email: {
          contains: email,
        },
      },
    });
    return findUsers;
  }

  static exclude<User, Key extends keyof User>(
    user: User,
    ...keys: Key[]
  ): Omit<User, Key> {
    for (const key of keys) {
      delete user[key];
    }
    return user;
  }

  static async blockUser({ id }: { id: string }) {
    const user: User = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        isActive: false,
      },
    });
  }
}
