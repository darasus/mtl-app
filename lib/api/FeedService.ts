import prisma from "../prisma";
import { Post } from "../../types/Post";
import * as R from "ramda";
import Prisma from ".prisma/client";
import { authorFragment } from "../../services/fragments/authorFragment";
import { likeFragment } from "../../services/fragments/likeFragment";
import { commentFragment } from "../../services/fragments/commentFragment";
import { tagsFragment } from "../../services/fragments/tagsFragment";

type InputPost = Prisma.Post & {
  likes: (Prisma.Like & { author: Prisma.User | null })[];
  comments: Prisma.Comment[];
  commentsCount: number;
  tags: (Prisma.TagsOnPosts & { tag: Prisma.Tag })[];
};

export type FetchFeedResponse = {
  items: Post[];
  count: number;
  cursor: number;
  total: number;
};

export class FeedService {
  preparePost = (post: InputPost, userId: number | undefined): Post => {
    const isLikedByMe = post.likes.some(
      (like: any) => like.author?.id === userId
    );

    return {
      ...R.omit(["likes"], post),
      likesCount: post.likes.length,
      isLikedByMe,
    };
  };

  async fetchFeed({
    userId,
    take = 25,
    cursor,
  }: {
    userId?: number;
    take?: number;
    cursor?: number;
  }): Promise<FetchFeedResponse> {
    const query = {
      where: {
        published: true,
      },
    } as const;
    const total = await prisma.post.count({
      ...query,
    });
    const posts = await prisma.post.findMany({
      ...query,
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
          select: authorFragment,
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
        cursor: 0,
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
