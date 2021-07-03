import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import prisma from "../../../../lib/prisma";
import { Post } from "../../../../types/Post";
import invariant from "invariant";
import * as R from "ramda";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "PUT",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  const session = await getSession({ req });

  if (!session) {
    return res.status(401);
  }

  const { title, content, description, published = true } = req.body;

  try {
    const post = await prisma.post.update({
      where: {
        id: Number(req.query.id),
      },
      data: {
        title,
        content,
        description,
        published,
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
  } catch (error) {
    return error;
  }
}
