import { NextApiRequest } from "next";
import { getCsrfToken, getSession } from "next-auth/client";
import { createUseMeQueryCacheKey } from "../../hooks/query/useMeQuery";
import prisma from "../prisma";
import cache from "../cache";
import { User } from "../../types/User";
import { userFragment } from "../fragments/userFragment";
import { getToken } from "next-auth/jwt";

export class UserSessionService {
  req: NextApiRequest | null;

  constructor({ req }: { req: NextApiRequest }) {
    this.req = req;
  }

  async get(): Promise<User | null> {
    const token = await getToken({
      req: this.req!,
      secret: process.env.SECRET,
    });

    if (!token || !token.email) {
      return null;
    }

    const { name, email } = token;

    const user = await cache.fetch(
      JSON.stringify([...createUseMeQueryCacheKey(), { name, email }]),
      async () =>
        prisma.user.findUnique({
          where: { email },
          select: userFragment,
        }),
      60 * 60 * 24 * 7
    );

    return user;
  }
}
