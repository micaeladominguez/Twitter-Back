import { PrismaClient } from "@prisma/client";
import { User } from "@/components/user/models";
import {
  CreateUserInput,
  UpdateUserInput,
} from "@/components/user/validator/types";

export class UserService {
  private static prisma: PrismaClient = new PrismaClient();

  public static async createUser({
    createUserInput,
  }: {
    createUserInput: CreateUserInput;
  }): Promise<User> {
    const user: User = await this.prisma.user.create({
      data: createUserInput,
    });
    return user;
  }
  public static async updateUser({
    updateUserInput,
    id,
  }: {
    updateUserInput: UpdateUserInput;
    id: number;
  }): Promise<User> {
    const findUser = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!findUser) throw new Error("user not found");
    const user: User = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateUserInput,
    });
    return user;
  }
}
