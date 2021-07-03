import { NextApiRequest } from "next";
import { getSession } from "next-auth/client";
import prisma from "../../lib/prisma";
import { Post } from "../../types/Post";
import * as R from "ramda";

const postQueryIncludeFragment = {
  include: {
    author: {
      select: {
        name: true,
        email: true,
        id: true,
        userName: true,
        updatedAt: true,
        emailVerified: true,
        createdAt: true,
        image: true,
      },
    },
    likes: {
      select: {
        id: true,
        author: {
          select: {
            email: true,
          },
        },
      },
    },
  },
};

export class PostService {
  req: NextApiRequest;

  constructor({ req }: { req: NextApiRequest }) {
    this.req = req;
  }

  async fetchFeed(): Promise<Post[]> {
    const session = await getSession({ req: this.req });
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      ...postQueryIncludeFragment,
    });

    return posts.map((post) => {
      const likes = post.likes.length;
      const isLikedByMe = post.likes.some(
        (like) => like.author?.email === session?.user?.email
      );

      return {
        ...R.omit(["likes"], post),
        likes,
        isLikedByMe,
      };
    });
  }

  async fetchPost(): Promise<Post | null> {
    const session = await getSession({ req: this.req });
    const post = await prisma.post.findUnique({
      where: {
        id: Number(this.req.query.id),
      },
      ...postQueryIncludeFragment,
    });

    if (!post) return null;

    const likes = post.likes.length;
    const isLikedByMe = post.likes.some(
      (like) => like.author?.email === session?.user?.email
    );

    return {
      ...R.omit(["likes"], post),
      likes,
      isLikedByMe,
    };
  }
}
