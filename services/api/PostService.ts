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

type InputPost = Prisma.Post & {
  likes: (Prisma.Like & { author: Prisma.User | null })[];
  comments: Prisma.Comment[];
  commentsCount: number;
};

export class PostService {
  req: NextApiRequest;

  constructor({ req }: { req: NextApiRequest }) {
    this.req = req;
  }

  preparePost = (post: InputPost, session: Session | null): Post => {
    const isLikedByMe = post.likes.some(
      (like: any) => like.author?.email === session?.user?.email
    );

    return {
      ...R.omit(["likes"], post),
      likesCount: post.likes.length,
      isLikedByMe,
    };
  };

  async fetchFeed(): Promise<Post[]> {
    const session = await getSession({ req: this.req });
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
      .map((post) => this.preparePost(post, session));
  }

  async fetchUserPosts(): Promise<Post[]> {
    const session = await getSession({ req: this.req });
    const posts = await prisma.post.findMany({
      where: {
        authorId: Number(this.req.query.id),
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

    return posts.map((post) =>
      this.preparePost(
        {
          ...post,
          commentsCount: post.comments.length,
          comments: post.comments.slice(-3),
        },
        session
      )
    );
  }

  async updatePost() {
    const { title, content, description, published = true } = this.req.body;
    await prisma.post.update({
      where: {
        id: Number(this.req.query.id),
      },
      data: {
        title,
        content,
        description,
        published,
      },
    });
  }

  async unpublishPost() {
    await prisma.post.update({
      where: { id: Number(this.req.query.id) },
      data: {
        published: false,
      },
    });
  }

  async publishPost() {
    await prisma.post.update({
      where: { id: Number(this.req.query.id) },
      data: {
        published: true,
      },
    });
  }

  async createPost() {
    const session = await getSession({ req: this.req });
    const { title, content, description } = this.req.body;
    const post = await prisma.post.create({
      data: {
        title,
        content,
        description,
        published: true,
        author: { connect: { email: session?.user?.email as string } },
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

    return this.preparePost({ ...post, commentsCount: 0 }, session);
  }

  async savePost() {
    const session = await getSession({ req: this.req });
    const { title, content, description } = this.req.body;
    await prisma.post.create({
      data: {
        title,
        content,
        description,
        published: false,
        author: { connect: { email: session?.user?.email as string } },
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

  async fetchPost(): Promise<Post | null> {
    const session = await getSession({ req: this.req });
    const post = await prisma.post.findUnique({
      where: {
        id: Number(this.req.query.id),
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

    return this.preparePost(
      {
        ...post,
        commentsCount: post.comments.length,
        comments: post.comments.slice(-3),
      },
      session
    );
  }

  async deletePost() {
    await prisma.post.delete({
      where: { id: Number(this.req.query.id) },
    });
  }
}
