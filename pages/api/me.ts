import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserSessionService } from "../../lib/api/UserSessionService";
import { getToken } from "next-auth/jwt";

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
    res.send(user);
  } catch (error) {
    return res.end(error);
  }
}
