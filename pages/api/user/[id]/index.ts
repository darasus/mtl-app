import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserService } from "../../../../lib/api/UserService";
import { withSentry } from "@sentry/nextjs";

export default withSentry(async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof req.query.id === "string", "User ID is not provided");

  try {
    const userService = new UserService();
    const user = await userService.getUserById(Number(req.query.id));
    res.json(user);
  } catch (error) {
    return res.end(error);
  }
});
