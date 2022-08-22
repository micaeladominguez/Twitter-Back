import { CreateTweetInput } from "@/components/tweet/validator/types";
import { PrismaClient } from "@prisma/client";
import { Tweet } from "@/components/tweet/model";
import { exclude } from "@/components/utils/methods";
import { User } from "@/components/user/models";

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
      return exclude(tweet, "deletedAt");
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
    const tweetsExcluded: Tweet[] = [];
    tweets.forEach((tweet) => {
      tweetsExcluded.push(exclude(tweet, "deletedAt"));
    });

    return tweetsExcluded;
  }

  public async findById(tweetId: string) {
    return await this.prisma.tweet.findUnique({
      where: {
        id: tweetId,
      },
    });
  }
}
