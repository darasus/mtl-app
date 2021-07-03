import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/client";
import { Post } from "../../../types/Post";
import * as R from "ramda";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, content, description } = req.body;
  const session = await getSession({ req });

  if (!session) {
    return res.status(401);
  }

  if (req.method === "POST") {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        description,
        published: false,
        author: { connect: { email: session?.user?.email as string } },
      },
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
          },
          include: {
            author: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });
    const newPost: Post = {
      ...R.omit(["likes"], post),
      likes: post.likes.length,
      isLikedByMe: post.likes.some(
        (like) => like.author?.email === session.user?.email
      ),
    };
    res.json(newPost);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
