import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { FollowService } from "../../../../../lib/api/FollowService";
import { getUserSession } from "../../../../../lib/getUserSession";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(typeof req.query.id === "string", "User ID is not provided");
  invariant(
    req.method === "POST" || req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  const user = await getUserSession({ req });

  if (req.method === "GET") {
    try {
      if (!user?.id) {
        return res.status(401).end();
      }

      const followService = new FollowService();
      const response = await followService.doIFollow({
        followingUserId: Number(req.query.id),
        followerUserId: user.id,
      });
      return res.json({ doIFollow: response.doIFollow });
    } catch (error) {
      return res.end(error);
    }
  }

  if (req.method === "POST") {
    try {
      if (!user?.id) {
        return res.status(401).end();
      }

      const followService = new FollowService();
      await followService.followUser(Number(req.query.id), user.id);
      return res.json({ status: "success" });
    } catch (error) {
      return res.end(error);
    }
  }
}
