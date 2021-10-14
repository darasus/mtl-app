import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { performance } from "perf_hooks";
import { UserService } from "../../services/api/UserService";
import { UserSessionService } from "../../services/api/UserSessionService";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  try {
    const userService = await new UserSessionService({ req }).get();
    res.send(userService);
  } catch (error) {
    return error;
  }
}
