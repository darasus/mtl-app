import { NextApiRequest } from "next";
import { getSession } from "next-auth/client";
import prisma from "../../lib/prisma";
import { Post } from "../../types/Post";
import * as R from "ramda";
import invariant from "invariant";
import Prisma from ".prisma/client";
import { Session } from "next-auth";

type InputPost = Prisma.Post & {
  likes: (Prisma.Like & { author: Prisma.User | null })[];
  comments: Prisma.Comment[];
};

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
        postId: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        author: {
          select: {
            id: true,
            name: true,
            userName: true,
            image: true,
            emailVerified: true,
            createdAt: true,
            email: true,
            updatedAt: true,
          },
        },
      },
    },
    comments: {
      select: {
        id: true,
        content: true,
        createdAt: true,
        postId: true,
        updatedAt: true,
        authorId: true,
        author: {
          select: {
            id: true,
            name: true,
            userName: true,
            image: true,
            emailVerified: true,
            createdAt: true,
            email: true,
            updatedAt: true,
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

  preparePost = (post: InputPost, session: Session | null): Post => {
    const likes = post.likes.length;
    const isLikedByMe = post.likes.some(
      (like: any) => like.author?.email === session?.user?.email
    );

    return {
      ...R.omit(["likes"], post),
      likes,
      isLikedByMe,
    };
  };

  async fetchFeed(): Promise<Post[]> {
    const session = await getSession({ req: this.req });
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      ...postQueryIncludeFragment,
    });

    return posts.map((post) => this.preparePost(post, session));
  }

  async fetchUserPosts(): Promise<Post[]> {
    const session = await getSession({ req: this.req });
    const posts = await prisma.post.findMany({
      where: {
        authorId: Number(this.req.query.id),
      },
      ...postQueryIncludeFragment,
    });

    return posts.map((post) => this.preparePost(post, session));
  }

  async addComment() {
    const session = await getSession({ req: this.req });

    await prisma.comment.create({
      data: {
        content: this.req.body.content,
        post: { connect: { id: Number(this.req.query.id) } },
        author: { connect: { email: session?.user?.email! } },
      },
    });
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
      ...postQueryIncludeFragment,
    });

    return this.preparePost(post, session);
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
      ...postQueryIncludeFragment,
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

    return this.preparePost(post, session);
  }

  async deletePost() {
    await prisma.post.delete({
      where: { id: Number(this.req.query.id) },
    });
  }

  async likePost() {
    const session = await getSession({ req: this.req });
    await prisma.like.create({
      data: {
        post: { connect: { id: Number(this.req.query.id) } },
        author: { connect: { email: session?.user?.email! } },
      },
    });
  }
}
