import { CreateTweetInput } from "@/components/tweet/validator/types";
import { PrismaClient } from "@prisma/client";

export class TweetService {
  constructor(private readonly prisma: PrismaClient) {}
  public async createTweet({
    id,
    validatedTweetBody,
  }: {
    id: string;
    validatedTweetBody: CreateTweetInput;
  }) {
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

  public async deleteTweet({ id }: { id: string }) {
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

  public async getMyTweets({ id }: { id: string }) {
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
