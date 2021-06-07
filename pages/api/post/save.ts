import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/client";
import { Post } from "../../../types/Post";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, content, description } = req.body;
  const session = await getSession({ req });

  if (req.method === "POST") {
    const post: Post = await prisma.post.create({
      data: {
        title,
        content,
        description,
        published: false,
        author: { connect: { email: session?.user?.email } },
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
