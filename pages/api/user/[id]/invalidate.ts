import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { getCsrfToken } from "next-auth/client";
import { createUseMeQueryCacheKey } from "../../../../hooks/query/useMeQuery";
import cache from "../../../../lib/cache";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof req.query.id === "string", "User ID is not provided");

  const csrfToken = await getCsrfToken({ req });

  try {
    if (csrfToken) {
      await cache.del(
        JSON.stringify([...createUseMeQueryCacheKey(), csrfToken])
      );
    }
    res.json({ success: true });
  } catch (error) {
    return res.end(error);
  }
}
