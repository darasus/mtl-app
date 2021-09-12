import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { UserService } from "../../../../services/api/UserService";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof req.query?.id === "string", "User ID is not provided");

  const session = await getSession({ req });

  try {
    const userService = new UserService({ session });
    const followingUserId = Number(req.query.id);
    await userService.unfollowUser(followingUserId);
    res.json({ status: "success" });
  } catch (error) {
    return error;
  }
}
