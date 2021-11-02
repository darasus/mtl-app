import { days } from "../../utils/duration";
import cache from "../cache";
import prisma from "../prisma";
import { redisCacheKey } from "../RedisCacheKey";

export class FollowService {
  async getNumberOfFollowers(userId: number) {
    const response = await cache.fetch(
      redisCacheKey.createUserFollowerCountKey(userId),
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

  async followUser({
    followingUserId,
    followerUserId,
  }: {
    followingUserId: number;
    followerUserId: number;
  }) {
    const response = await prisma.follow.create({
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
      redisCacheKey.createDoIFollowKey({
        followingUserId,
        followerUserId,
      })
    );

    await cache.del(redisCacheKey.createUserFollowerCountKey(followingUserId));

    return response;
  }

  async unfollowUser({
    followingUserId,
    followerUserId,
  }: {
    followingUserId: number;
    followerUserId: number;
  }) {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: followerUserId,
          followingId: followingUserId,
        },
      },
    });

    await cache.del(
      redisCacheKey.createDoIFollowKey({
        followingUserId,
        followerUserId,
      })
    );
    await cache.del(redisCacheKey.createUserFollowerCountKey(followingUserId));
  }

  async doIFollow({
    followingUserId,
    followerUserId,
  }: {
    followingUserId: number;
    followerUserId: number;
  }) {
    const response = await cache.fetch(
      redisCacheKey.createDoIFollowKey({
        followingUserId,
        followerUserId,
      }),
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
