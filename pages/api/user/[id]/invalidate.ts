import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import cache from "../../../../lib/cache";
import { redisCacheKey } from "../../../../lib/RedisCacheKey";
import { processErrorResponse } from "../../../../utils/error";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof req.query.id === "string", "User ID is not provided");

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const token = await getToken({
    req,
    secret: process.env.SECRET as string,
  });

  try {
    if (token && token.email) {
      const { email } = token;
      await cache.del(redisCacheKey.createUserSessionKey(email));
      return res.json({ success: true });
    }
    return res.json({ success: false });
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
}
