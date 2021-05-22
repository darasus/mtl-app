import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { getSession } from "next-auth/client";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, content, description } = req.body;
  const session = await getSession({ req });

  if (req.method === "POST") {
    const result = await prisma.post.create({
      data: {
        title,
        content,
        description,
        author: { connect: { email: session?.user?.email } },
      },
    });
    res.json(result);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
