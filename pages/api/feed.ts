import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { Post } from "../../types/Post";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const feed: Post[] = await prisma.post.findMany({
      where: {
        published: true,
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

    res.status(200);
    res.send(feed);
  } catch (error) {}
}
