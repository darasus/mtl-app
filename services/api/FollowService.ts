import { Session } from "next-auth";
import prisma from "../../lib/prisma";

export class FollowService {
  async getNumberOfFollowers(userId: number) {
    return prisma.follow.count({
      where: {
        follower: {
          id: userId,
        },
      },
    });
  }

  async followUser(followingUserId: number, followerUserId: number) {
    await prisma.follow.create({
      data: {
        follower: {
          connect: {
            id: followerUserId,
          },
        },
        following: {
          connect: {
            id: followingUserId,
          },
        },
      },
    });
  }

  async unfollowUser(followingUserId: number, followerUserId: number) {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: followerUserId,
          followingId: followingUserId,
        },
      },
    });
  }

  async doIFollow(followingUserId: number, followerUserId: number) {
    const response = await prisma.follow.findFirst({
      where: {
        followingId: followingUserId,
        followerId: followerUserId,
      },
    });

    return { doIFollow: !!response };
  }
}
