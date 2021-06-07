import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import prisma from "../../../../lib/prisma";
import { Post } from "../../../../types/Post";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const posts: Post[] = await prisma.post.findMany({
        where: {
          authorId: Number(req.query.id),
        },
        include: {
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
      });
      res.send(posts);
    } else {
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      );
    }
  } catch (error) {
    return error;
  }
}
