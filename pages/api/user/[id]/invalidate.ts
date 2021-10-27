import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { getCsrfToken } from "next-auth/client";
import { getToken } from "next-auth/jwt";
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

  const token = await getToken({
    req,
    secret: process.env.SECRET,
  });

  try {
    if (token && token.email) {
      const { name, email } = token;
      await cache.del(
        JSON.stringify([...createUseMeQueryCacheKey(), { name, email }])
      );
      return res.json({ success: true });
    }
    return res.json({ success: false });
  } catch (error) {
    return res.end(error);
  }
}
