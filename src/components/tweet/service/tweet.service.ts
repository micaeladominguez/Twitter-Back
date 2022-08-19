import { CreateTweetInput } from "@/components/tweet/validator/types";
import { PrismaClient } from "@prisma/client";
import { UserService } from "@/components/user/services/user.service";

export class TweetService {
  private static prisma: PrismaClient = new PrismaClient();
  static async createTweet({
    id,
    validatedTweetBody,
  }: {
    id: string;
    validatedTweetBody: CreateTweetInput;
  }) {
    const user = UserService.findUserById({ id: id });
    if (!user) throw new Error("Invalid creation");
    try {
      const tweet = await this.prisma.tweet.create({
        data: {
          authorId: id,
          content: validatedTweetBody.content,
        },
      });
      return tweet;
    } catch (e) {
      throw new Error("Invalid creation");
    }
  }

  static async deleteTweet({ id, userId }: { id: string; userId: string }) {
    const user = UserService.findUserById({ id: userId });
    if (!user) throw new Error("Invalid creation");
    const tweet = await this.prisma.tweet.findUnique({
      where: {
        id: id,
      },
    });
    if (!tweet) throw new Error("Invalid delete");
    try {
      await this.prisma.tweet.update({
        where: {
          id: id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    } catch (e) {
      throw new Error("Invalid delete");
    }
  }

  static async getMyTweets({ id }: { id: string }) {
    const user = UserService.findUserById({ id: id });
    if (!user) throw new Error("Invalid creation");
    const tweets = await this.prisma.tweet.findMany({
      where: {
        authorId: id,
        deletedAt: null,
      },
    });
    console.log(tweets);
    return tweets;
  }
}
