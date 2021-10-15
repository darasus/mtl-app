import { createUseDoIFollowUserQueryQueryCache } from "../../hooks/query/useDoIFollowUserQuery";
import cache from "../cache";
import prisma from "../prisma";

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

    await cache.del(
      JSON.stringify([
        ...createUseDoIFollowUserQueryQueryCache(followingUserId),
        ...createUseDoIFollowUserQueryQueryCache(followerUserId),
      ])
    );
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

    await cache.del(
      JSON.stringify([
        ...createUseDoIFollowUserQueryQueryCache(followingUserId),
        ...createUseDoIFollowUserQueryQueryCache(followerUserId),
      ])
    );
  }

  async doIFollow({
    followingUserId,
    followerUserId,
  }: {
    followingUserId: number;
    followerUserId: number;
  }) {
    const response = await cache.fetch(
      JSON.stringify([
        ...createUseDoIFollowUserQueryQueryCache(followingUserId),
        ...createUseDoIFollowUserQueryQueryCache(followerUserId),
      ]),
      () =>
        prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: followerUserId,
              followingId: followingUserId,
            },
          },
        }),
      60 * 60 * 24
    );

    return { doIFollow: !!response };
  }
}
