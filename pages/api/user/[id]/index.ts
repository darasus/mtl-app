import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import prisma from "../../../../lib/prisma";
import { Post } from "../../../../types/Post";
import { User } from "../../../../types/User";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const user: User = await prisma.user.findUnique({
        where: {
          id: Number(req.query.id),
        },
      });
      res.send(user);
    } else {
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      );
    }
  } catch (error) {
    return error;
  }
}
