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

  const { title, content, description } = req.body;

  if (req.method === "PUT") {
    const post: Post = await prisma.post.update({
      where: {
        id: Number(req.query.id),
      },
      data: {
        title,
        content,
        description,
        published: true,
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
    res.json(post);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
