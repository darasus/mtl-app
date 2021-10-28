import { createUseDoIFollowUserQueryQueryCache } from "../../hooks/query/useDoIFollowUserQuery";
import { createUseFollowersCountQueryCacheKey } from "../../hooks/query/useFollowersCountQuery";
import { days } from "../../utils/duration";
import cache from "../cache";
import prisma from "../prisma";

export class FollowService {
  async getNumberOfFollowers(userId: number) {
    const response = await cache.fetch(
      JSON.stringify(createUseFollowersCountQueryCacheKey(userId)),
      async () => {
        const response = prisma.follow.count({
          where: {
            followingId: userId,
          },
        });
        return response;
      },
      days(365)
    );

    return response;
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
    await cache.del(
      JSON.stringify(createUseFollowersCountQueryCacheKey(followingUserId))
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
    await cache.del(
      JSON.stringify(createUseFollowersCountQueryCacheKey(followingUserId))
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
      async () => {
        const response = await prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: followerUserId,
              followingId: followingUserId,
            },
          },
        });
        return response || false;
      },
      days(365)
    );

    return { doIFollow: !!response };
  }
}
