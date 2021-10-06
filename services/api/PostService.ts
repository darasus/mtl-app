import { NextApiRequest } from "next";
import { getSession } from "next-auth/client";
import prisma from "../../lib/prisma";
import { Post } from "../../types/Post";
import * as R from "ramda";
import invariant from "invariant";
import Prisma from ".prisma/client";
import { Session } from "next-auth";
import { authorFragment } from "../fragments/authorFragment";
import { likeFragment } from "../fragments/likeFragment";
import { commentFragment } from "../fragments/commentFragment";
import { preparePost } from "../utils/preparePost";

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
  }

  async unpublishPost(postId: number) {
    await prisma.post.update({
      where: { id: postId },
      data: {
        published: false,
      },
    });
  }

  async publishPost(postId: number) {
    await prisma.post.update({
      where: { id: postId },
      data: {
        published: true,
      },
    });
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
    const post = await prisma.post.findUnique({
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
    });

    if (!post) return null;

    return preparePost(
      {
        ...post,
        commentsCount: post.comments.length,
        comments: post.comments.slice(-3),
      },
      userId
    );
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
  }
}
