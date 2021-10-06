import invariant from "invariant";
import { Session } from "next-auth";
import prisma from "../../lib/prisma";
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
  async getUserById(id: number) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      ...selectQueryFragment,
    });
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
