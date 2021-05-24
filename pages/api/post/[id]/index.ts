import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import prisma from "../../../../lib/prisma";
import { Post } from "../../../../types/Post";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    res.status(401);
  }

  try {
    if (req.method === "GET") {
      const post: Post = await prisma.post.findUnique({
        where: {
          id: Number(req.query.id),
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
        },
      });
      res.send(post);
    } else {
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      );
    }
  } catch (error) {
    return error;
  }
}
