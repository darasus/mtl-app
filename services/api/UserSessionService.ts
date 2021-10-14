import invariant from "invariant";
import { NextApiRequest } from "next";
import { getSession } from "next-auth/client";

import { createUseMeQueryCacheKey } from "../../hooks/query/useMeQuery";
import prisma from "../../lib/prisma";
import cache from "../../server/cache";
import { User } from "../../types/User";
import { userFragment } from "../fragments/userFragment";

export class UserSessionService {
  req: NextApiRequest | null;

  constructor({ req }: { req: NextApiRequest }) {
    this.req = req;
  }

  async get(): Promise<User> {
    const user = await cache.fetch(
      JSON.stringify(createUseMeQueryCacheKey()),
      async () => {
        const session = await getSession({ req: this.req! });

        return prisma.user.findUnique({
          where: {
            email: session?.user?.email!,
          },
          select: userFragment,
        });
      },
      60 * 60 * 24
    );

    invariant(user?.id, "User is not found");

    return user;
  }
}
