import { PrismaClient} from "@prisma/client";
import { Retweet } from "@/components/retweet/model";
import { Tweet } from "@/components/tweet/model";
import { exclude } from "@/components/utils/methods";

export class RetweetService {
  constructor(private readonly prisma: PrismaClient) {}

  public async createRetweet(id: string, tweetId: string) {
    try {
      const tweet = await this.prisma.userInteraction.create({
        data: {
          userId: id,
          tweetId: tweetId,
          type: "RETWEET",
        },
        include: {
          tweet: true,
        },
      });
      return tweet;
    } catch (e) {
      throw new Error("Invalid creation");
    }
  }

  public async deleteRetweet(userId: string, tweetId: string) {
    try {
      const retweet = await this.prisma.userInteraction.findFirst({
        where: {
          userId: userId,
          tweetId: tweetId,
          type: "RETWEET",
        },
      });
      if (retweet) {
        await this.prisma.userInteraction.update({
          where: {
            id: retweet.id,
          },
          data: {
            deletedAt: new Date(),
          },
        });
      }
    } catch (e) {
      throw new Error("Invalid creation");
    }
  }

  public async getRetweets(id: string) {
    const retweets = await this.prisma.userInteraction.findMany({
      where: {
        userId: id,
        type: "RETWEET",
      },
      include: {
        tweet: true,
      },
    });
    const tweetsExcluded: Omit<Tweet, "deletedAt">[] = [];
    retweets.forEach((retweet) => {
      tweetsExcluded.push(exclude(retweet.tweet, "deletedAt"));
    });
    return tweetsExcluded;
  }
}
