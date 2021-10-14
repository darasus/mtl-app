import prisma from "../../lib/prisma";
import { Post } from "../../types/Post";
import Prisma from ".prisma/client";
import { authorFragment } from "../fragments/authorFragment";
import { likeFragment } from "../fragments/likeFragment";
import { commentFragment } from "../fragments/commentFragment";
import { preparePost } from "../utils/preparePost";
import cache from "../../server/cache";
import { createUsePostQueryCacheKey } from "../../hooks/query/usePostQuery";

type InputPost = Prisma.Post & {
  likes: (Prisma.Like & { author: Prisma.User | null })[];
  comments: Prisma.Comment[];
  commentsCount: number;
};

export class PostService {
  async updatePost(
    {
      title,
      content,
      description,
    }: {
      title: string;
      content: string;
      description: string;
    },
    postId: number
  ) {
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title,
        content,
        description,
      },
    });

    await cache.del(JSON.stringify(createUsePostQueryCacheKey(postId)));
  }

  async unpublishPost(postId: number) {
    await prisma.post.update({
      where: { id: postId },
      data: {
        published: false,
      },
    });

    await cache.del(JSON.stringify(createUsePostQueryCacheKey(postId)));
  }

  async publishPost(postId: number) {
    await prisma.post.update({
      where: { id: postId },
      data: {
        published: true,
      },
    });

    await cache.del(JSON.stringify(createUsePostQueryCacheKey(postId)));
  }

  async createPost(
    {
      title,
      content,
      description,
    }: { title: string; content: string; description: string },
    userId: number
  ) {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        description,
        published: true,
        author: { connect: { id: userId } },
      },
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
      },
    });

    return preparePost({ ...post, commentsCount: 0 }, userId);
  }

  async savePost(
    {
      title,
      content,
      description,
    }: { title: string; content: string; description: string },
    userId: number
  ) {
    await prisma.post.create({
      data: {
        title,
        content,
        description,
        published: false,
        author: { connect: { id: userId } },
      },
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
      },
    });
  }

  async fetchPost(postId: number, userId?: number): Promise<Post | null> {
    const post = await cache.fetch(
      JSON.stringify(createUsePostQueryCacheKey(postId)),
      () =>
        prisma.post.findUnique({
          where: {
            id: postId,
          },
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
          },
        }),
      60 * 60 * 24
    );

    if (!post) return null;

    return preparePost(
      {
        ...post,
        commentsCount: post.comments.length,
        comments: post.comments.slice(-5),
      },
      userId
    );
  }

  async findPostByCommentId(commentId: number) {
    const post = await prisma.post.findFirst({
      where: {
        comments: {
          some: {
            id: commentId,
          },
        },
      },
    });

    return post;
  }

  async deletePost(postId: number) {
    await prisma.like.deleteMany({
      where: {
        postId,
      },
    });

    await prisma.comment.deleteMany({
      where: {
        postId,
      },
    });

    await prisma.post.delete({
      where: { id: postId },
    });

    await cache.del(JSON.stringify(createUsePostQueryCacheKey(postId)));
  }
}
