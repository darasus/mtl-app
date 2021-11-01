import { createUseUserQueryCacheKey } from "../../hooks/query/useUserQuery";
import prisma from "../prisma";
import cache from "../cache";
import { Post } from "../../types/Post";
import { authorFragment } from "../fragments/authorFragment";
import { commentFragment } from "../fragments/commentFragment";
import { likeFragment } from "../fragments/likeFragment";
import { tagsFragment } from "../fragments/tagsFragment";
import { preparePost } from "../utils/preparePost";
import { RedisCacheKey } from "../RedisCacheKey";
import { days } from "../../utils/duration";
import { activityFragment } from "../fragments/activityFragment";

const selectQueryFragment = {
  select: {
    userName: true,
    email: true,
    id: true,
    image: true,
    name: true,
    emailVerified: true,
    createdAt: true,
    updatedAt: true,
  },
};

export class UserService {
  async getUserByEmail(email: string) {
    const redisCacheKey = new RedisCacheKey();

    return cache.fetch(
      redisCacheKey.createUserSessionKey(email),
      () =>
        prisma.user.findUnique({
          where: {
            email,
          },
          ...selectQueryFragment,
        }),
      days(365)
    );
  }

  async getUserById(userId: number) {
    return cache.fetch(
      JSON.stringify(createUseUserQueryCacheKey(userId)),
      () =>
        prisma.user.findUnique({
          where: {
            id: userId,
          },
          ...selectQueryFragment,
        }),
      days(365)
    );
  }

  async getUserPosts(userId: number, isMe: boolean): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
        ...(isMe ? {} : { published: true }),
      },
      orderBy: [
        {
          id: "desc",
        },
      ],
      include: {
        author: {
          select: authorFragment,
        },
        likes: {
          select: likeFragment,
        },
        comments: {
          select: commentFragment,
        },
        tags: tagsFragment,
      },
    });

    return posts.map((post) =>
      preparePost(
        {
          ...post,
          commentsCount: post.comments.length,
          comments: post.comments.slice(-5),
        },
        userId
      )
    );
  }

  async getUserActivity({
    userId,
    cursor,
    take = 10,
  }: {
    userId: number;
    cursor?: number;
    take?: number;
  }) {
    const activityCount = await prisma.activity.count({
      where: {
        ownerId: userId,
      },
    });

    const activity = await prisma.activity.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        ...activityFragment,
        follow: {
          include: {
            follower: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          id: "desc",
        },
      ],
      ...(cursor
        ? {
            cursor: {
              id: cursor,
            },
          }
        : {}),
      take,
      skip: cursor ? 1 : 0,
    });

    if (activity.length === 0) {
      return {
        items: [],
        count: 0,
        total: 0,
        cursor: 0,
      };
    }

    const lastActivityInResults = activity[activity.length - 1];
    const newCursor = lastActivityInResults.id;

    return {
      items: activity,
      count: activity.length,
      total: activityCount,
      cursor: newCursor,
    };
  }
}
