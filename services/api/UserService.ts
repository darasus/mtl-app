import { createUseUserQueryCacheKey } from "../../hooks/query/useUserQuery";
import prisma from "../../lib/prisma";
import cache from "../../server/cache";
import { Post } from "../../types/Post";
import { authorFragment } from "../fragments/authorFragment";
import { commentFragment } from "../fragments/commentFragment";
import { likeFragment } from "../fragments/likeFragment";
import { preparePost } from "../utils/preparePost";

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
      60 * 60 * 24
    );
  }

  async getUserPosts(userId: number): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
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

    return posts.map((post) =>
      preparePost(
        {
          ...post,
          commentsCount: post.comments.length,
          comments: post.comments.slice(-3),
        },
        userId
      )
    );
  }
}
