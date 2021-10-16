import prisma from "../prisma";
import { Post } from "../../types/Post";
import Prisma, { CodeLanguage } from ".prisma/client";
import { authorFragment } from "../fragments/authorFragment";
import { likeFragment } from "../fragments/likeFragment";
import { commentFragment } from "../fragments/commentFragment";
import { preparePost } from "../utils/preparePost";
import cache from "../cache";
import { createUsePostQueryCacheKey } from "../../hooks/query/usePostQuery";
import { tagsFragment } from "../fragments/tagsFragment";

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
      codeLanguage,
      tagId,
    }: {
      title: string;
      content: string;
      description: string;
      codeLanguage: CodeLanguage;
      tagId: number;
    },
    postId: number
  ) {
    const oldPost = await prisma.post.findFirst({
      where: {
        id: postId,
      },
      include: {
        tags: {
          select: {
            tagId: true,
          },
        },
      },
    });

    if (oldPost?.tags[0]?.tagId) {
      await prisma.tagsOnPosts.delete({
        where: {
          postId_tagId: {
            postId,
            tagId: oldPost?.tags[0].tagId!,
          },
        },
      });
    }

    await prisma.tagsOnPosts.create({
      data: {
        postId,
        tagId,
      },
    });

    const post = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title,
        content,
        description,
        codeLanguage,
        updatedAt: new Date(),
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
        tags: tagsFragment,
      },
    });

    await cache.del(JSON.stringify(createUsePostQueryCacheKey(postId)));

    return post;
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
    userId: number,
    {
      title,
      content,
      description,
      codeLanguage,
      tagId,
    }: {
      title: string;
      content: string;
      description: string;
      codeLanguage: CodeLanguage;
      tagId: number;
    }
  ) {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        description,
        published: true,
        codeLanguage,
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
        tags: tagsFragment,
      },
    });

    await prisma.tagsOnPosts.create({
      data: {
        postId: post.id,
        tagId,
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
        tags: tagsFragment,
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
            tags: tagsFragment,
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

    await prisma.tagsOnPosts.deleteMany({
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
