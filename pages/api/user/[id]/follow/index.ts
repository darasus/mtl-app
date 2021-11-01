import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { ActivityService } from "../../../../../lib/api/ActivityService";
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
  const followService = new FollowService();
  const activityService = new ActivityService();

  if (req.method === "GET") {
    try {
      const user = await getUserSession({ req });

      if (!user?.id) {
        return res.json({ doIFollow: false });
      }

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
      const user = await getUserSession({ req });

      if (!user?.id) {
        return res.status(401).end();
      }

      const response = await followService.followUser({
        followingUserId: Number(req.query.id),
        followerUserId: user.id,
      });

      await activityService.addFollowActivity({
        ownerId: Number(req.query.id),
        authorId: user.id,
        followFollowerId: response.followerId,
        followFollowingId: response.followingId,
      });

      return res.json(response);
    } catch (error) {
      return res.end(error);
    }
  }
}
