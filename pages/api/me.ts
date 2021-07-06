import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import prisma from "../../lib/prisma";
import { User } from "../../types/User";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    res.status(401);
    res.send({
      error: "Not authorized",
    });
  }

  try {
    const me: User | null = await prisma.user.findUnique({
      where: {
        email: session?.user?.email as string,
      },
      select: {
        userName: true,
        email: true,
        id: true,
        image: true,
        name: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200);
    res.send(me);
  } catch (error) {
    return error;
  }
}