import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import prisma from "../../lib/prisma";
import { User } from "../../types/User";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  console.log(session);

  if (!session) {
    res.status(401);
    res.send({});
  }

  try {
    const me: User = await prisma.user.findUnique({
      where: {
        email: session.user.email,
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
