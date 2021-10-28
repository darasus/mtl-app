import prisma from "../prisma";
import { Post } from "../../types/Post";
import { authorFragment } from "../fragments/authorFragment";
import { commentFragment } from "../fragments/commentFragment";
import { likeFragment } from "../fragments/likeFragment";
import { tagsFragment } from "../fragments/tagsFragment";
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
  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
      ...selectQueryFragment,
    });
  }

  async getUserById(userId: number) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      ...selectQueryFragment,
    });
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
}
