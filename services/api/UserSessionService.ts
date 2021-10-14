import invariant from "invariant";
import { NextApiRequest } from "next";
import { getCsrfToken, getSession } from "next-auth/client";

import { createUseMeQueryCacheKey } from "../../hooks/query/useMeQuery";
import prisma from "../../lib/prisma";
import cache from "../../server/cache";
import { User } from "../../types/User";
import { parseAppSessionFromCookies } from "../../utils/parseCookies";
import { userFragment } from "../fragments/userFragment";

export class UserSessionService {
  req: NextApiRequest | null;

  constructor({ req }: { req: NextApiRequest }) {
    this.req = req;
  }

  async get(): Promise<User | null> {
    const csrfToken = await getCsrfToken({ req: this.req! });

    if (!csrfToken) {
      return null;
    }

    const user = await cache.fetch(
      JSON.stringify([...createUseMeQueryCacheKey(), csrfToken]),
      async () => {
        const session = await getSession({ req: this.req! });

        if (!session) return null;

        return prisma.user.findUnique({
          where: {
            email: session?.user?.email!,
          },
          select: userFragment,
        });
      },
      60 * 60 * 24
    );

    return user;
  }
}
