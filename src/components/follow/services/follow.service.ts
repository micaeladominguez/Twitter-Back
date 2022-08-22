import { PrismaClient } from "@prisma/client";

export class FollowService {
  constructor(private readonly prisma: PrismaClient) {}

  public async createFollow(followerId: string, followingId: string) {
    const existingFollow = await this.prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: followingId,
        },
      },
    });
    if (existingFollow && existingFollow.unfollowedAt == null) {
      return existingFollow;
    } else if (existingFollow && existingFollow.unfollowedAt !== null) {
      const follow = await this.prisma.follows.update({
        where: {
          followerId_followingId: {
            followerId: followerId,
            followingId: followingId,
          },
        },
        data: {
          unfollowedAt: null,
        },
      });
      return follow;
    } else {
      try {
        const follow = await this.prisma.follows.create({
          data: {
            followerId: followerId,
            followingId: followingId,
          },
        });
        return follow;
      } catch (e) {
        throw new Error("Follow ");
      }
    }
  }

  public async getFollows(id: string) {
    const follows = await this.prisma.follows.findMany({
      where: {
        followerId: id,
      },
    });
    return follows;
  }
  public async getFollowers(id: string) {
    const followers = await this.prisma.follows.findMany({
      where: {
        followingId: id,
      },
    });
    return followers;
  }

  public async unfollow(id: string, unfollowToId: string) {
    const follow = await this.prisma.follows.findUnique({
      where: {
        followerId_followingId: { followerId: id, followingId: unfollowToId },
      },
    });
    if (!follow) throw new Error("Invalid delete");
    try {
      await this.prisma.follows.update({
        where: {
          followerId_followingId: { followerId: id, followingId: unfollowToId },
        },
        data: {
          unfollowedAt: new Date(),
        },
      });
    } catch (e) {
      throw new Error("Invalid delete");
    }
  }
}
