import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { FollowService } from "../../../../lib/api/FollowService";
import { getUserSession } from "../../../../lib/getUserSession";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof req.query.id === "string", "User ID is not provided");

  try {
    const user = await getUserSession({ req });

    if (!user?.id) {
      return res.status(401).end();
    }

    const followService = new FollowService();
    await followService.unfollowUser(Number(req.query.id), user.id);
    res.json({ status: "success" });
  } catch (error) {
    return res.end(error);
  }
}
