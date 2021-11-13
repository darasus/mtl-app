import prisma from "../prisma";
import { Post } from "../../types/Post";
import * as R from "ramda";
import Prisma, { Like, User } from ".prisma/client";
import { likeFragment } from "../fragments/likeFragment";
import { commentFragment } from "../fragments/commentFragment";
import { tagsFragment } from "../fragments/tagsFragment";
import { userFragment } from "../fragments/userFragment";

type InputPost = Prisma.Post & {
  likes: (Prisma.Like & { author: Omit<Prisma.User, "password"> | null })[];
  comments: Prisma.Comment[];
  commentsCount: number;
  tags: (Prisma.TagsOnPosts & { tag: Prisma.Tag })[];
  author: Omit<Prisma.User, "password"> | null;
};

export type FetchFeedResponse = {
  items: Post[];
  count: number;
  cursor: string | null;
  total: number;
};

export class FeedService {
  preparePost = (post: InputPost, userId: string | undefined): Post => {
    const isLikedByMe = post.likes.some(
      (like: Like & { author: Omit<User, "password"> | null }) =>
        like.author?.id === userId
    );

    return {
      ...R.omit(["likes"], post),
      likesCount: post.likes.length,
      isLikedByMe,
    };
  };

  async fetchFollowingFeed({
    userId,
    take = 25,
    cursor,
  }: {
    userId?: string;
    take?: number;
    cursor?: string;
  }): Promise<FetchFeedResponse> {
    if (!userId) {
      return {
        items: [],
        count: 0,
        total: 0,
        cursor: null,
      };
    }

    const me = await prisma.user.findMany({
      where: {
        id: userId,
      },
      select: {
        following: {
          select: {
            followingId: true,
          },
        },
      },
    });

    const followindUserIds = me[0].following.map((user) => user.followingId);

    const total = await prisma.post.count({
      where: {
        published: true,
        authorId: {
          in: followindUserIds,
        },
      },
    });

    const posts = await prisma.post.findMany({
      where: {
        published: true,
        authorId: {
          in: followindUserIds,
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
      include: {
        author: {
          select: userFragment,
        },
        likes: {
          select: likeFragment,
        },
        comments: {
          orderBy: [
            {
              id: "desc",
            },
          ],
          select: commentFragment,
        },
        tags: tagsFragment,
      },
    });

    if (posts.length === 0) {
      return {
        items: [],
        count: 0,
        total: 0,
        cursor: null,
      };
    }

    const lastPostInResults = posts[posts.length - 1];
    const newCursor = lastPostInResults.id;

    return {
      items: posts
        .map((post) => ({
          ...post,
          commentsCount: post.comments.length,
          comments: post.comments.reverse().splice(-5),
        }))
        .map((post) => this.preparePost(post, userId)),
      count: posts.length,
      cursor: newCursor,
      total,
    };
  }

  async fetchLatestFeed({
    userId,
    take = 25,
    cursor,
  }: {
    userId?: string;
    take?: number;
    cursor?: string;
  }): Promise<FetchFeedResponse> {
    const total = await prisma.post.count({
      where: {
        published: true,
      },
    });

    const posts = await prisma.post.findMany({
      where: {
        published: true,
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
      include: {
        author: {
          select: userFragment,
        },
        likes: {
          select: likeFragment,
        },
        comments: {
          orderBy: [
            {
              id: "desc",
            },
          ],
          select: commentFragment,
        },
        tags: tagsFragment,
      },
    });

    if (posts.length === 0) {
      return {
        items: [],
        count: 0,
        total: 0,
        cursor: null,
      };
    }

    const lastPostInResults = posts[posts.length - 1];
    const newCursor = lastPostInResults.id;

    return {
      items: posts
        .map((post) => ({
          ...post,
          commentsCount: post.comments.length,
          comments: post.comments.reverse().splice(-5),
        }))
        .map((post) => this.preparePost(post, userId)),
      count: posts.length,
      cursor: newCursor,
      total,
    };
  }
}
