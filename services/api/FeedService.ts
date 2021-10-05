import { NextApiRequest } from "next";
import { getSession } from "next-auth/client";
import prisma from "../../lib/prisma";
import { Post } from "../../types/Post";
import * as R from "ramda";
import Prisma from ".prisma/client";
import { authorFragment } from "../fragments/authorFragment";
import { likeFragment } from "../fragments/likeFragment";
import { commentFragment } from "../fragments/commentFragment";

type InputPost = Prisma.Post & {
  likes: (Prisma.Like & { author: Prisma.User | null })[];
  comments: Prisma.Comment[];
  commentsCount: number;
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

  async fetchFeed(userId: number | undefined): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
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
      },
    });

    return posts
      .map((post) => ({
        ...post,
        commentsCount: post.comments.length,
        comments: post.comments.splice(-3),
      }))
      .map((post) => this.preparePost(post, userId));
  }
}
