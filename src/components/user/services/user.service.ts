import { PrismaClient } from "@prisma/client";
import { User } from "@/components/user/models";
import {
  CreateUserInput,
  UpdateUserInput,
} from "@/components/user/validator/types";
import argon2 from "argon2";

export class UserService {
  constructor(private readonly prisma: PrismaClient) {}
  public async createUser(createUserInput: CreateUserInput) {
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
  public async updateUser({
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

  public async allUsers() {
    const users: User[] = await this.prisma.user.findMany();
    const usersWithoutPassword: User[] = [];
    users.forEach((user) => {
      usersWithoutPassword.push(this.exclude(user, "password"));
    });
    return usersWithoutPassword;
  }

  public async findUserByEmail({ email }: { email: string }) {
    const findUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!findUser) throw new Error("user not found");
    return findUser;
  }

  public async findUserById({ id }: { id: string }): Promise<User> {
    const findUser = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!findUser) throw new Error("user not found");
    const userWithoutPassword = this.exclude(findUser, "password");
    return userWithoutPassword;
  }

  public async allUsersLike({ email }: { email: string }) {
    const findUsers = await this.prisma.user.findMany({
      where: {
        email: {
          contains: email,
        },
      },
    });
    return findUsers;
  }

  private exclude<User, Key extends keyof User>(
    user: User,
    ...keys: Key[]
  ): Omit<User, Key> {
    for (const key of keys) {
      delete user[key];
    }
    return user;
  }

  public async blockUser({ id }: { id: string }) {
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
