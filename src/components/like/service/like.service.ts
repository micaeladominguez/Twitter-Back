import { PrismaClient } from "@prisma/client";
import { Tweet } from "@/components/tweet/model";
import { exclude } from "@/components/utils/methods";

export class LikeService {
  constructor(private readonly prisma: PrismaClient) {}
  public async createLike(id: string, tweetId: string) {
    try {
      const tweet = await this.prisma.userInteraction.create({
        data: {
          userId: id,
          tweetId: tweetId,
          type: "LIKE",
        },
        include: {
          tweet: true,
        },
      });
      return exclude(tweet, "deletedAt");
    } catch (e) {
      throw new Error("Invalid creation");
    }
  }

  public async deleteLike(id: string) {
    try {
      await this.prisma.userInteraction.update({
        where: {
          id: id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    } catch (e) {
      throw new Error("Invalid creation");
    }
  }

  public async getLikes(id: string) {
    const likes = await this.prisma.userInteraction.findMany({
      where: {
        userId: id,
        type: "LIKE",
        deletedAt: null,
      },
      include: {
        tweet: true,
      },
    });
    const tweetsExcluded: Omit<Tweet, "deletedAt">[] = [];
    likes.forEach((like) => {
      tweetsExcluded.push(exclude(like.tweet, "deletedAt"));
    });
    return tweetsExcluded;
  }
  public async findOne(id: string, tweetId: string) {
    return await this.prisma.userInteraction.findFirst({
      where: {
        userId: id,
        tweetId: tweetId,
        type: "LIKE",
        deletedAt: null,
      },
    });
  }
}
