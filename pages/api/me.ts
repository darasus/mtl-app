import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserSessionService } from "../../lib/api/UserSessionService";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  try {
    const user = await new UserSessionService({ req }).get();
    res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate=59");
    res.send(user);
  } catch (error) {
    return res.end(error);
  }
}
