import { withSession, WithSessionProp } from "@clerk/nextjs/api";
import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { ActivityService } from "../../../../../lib/prismaServices/ActivityService";
import { FollowService } from "../../../../../lib/prismaServices/FollowService";
import { processErrorResponse } from "../../../../../utils/error";

export default withSession(async function handle(
  req: WithSessionProp<NextApiRequest>,
  res: NextApiResponse
) {
  invariant(typeof req.query.id === "string", "User ID is not provided");
  invariant(
    req.method === "POST" || req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  const followService = new FollowService();
  const activityService = new ActivityService();
  const me = req.session;

  if (req.method === "GET") {
    try {
      if (!me?.userId) {
        return res.json({ doIFollow: false });
      }

      const response = await followService.doIFollow({
        followingUserId: req.query.id,
        followerUserId: me.userId,
      });

      return res.json({ doIFollow: response.doIFollow });
    } catch (error) {
      return res.end(processErrorResponse(error));
    }
  }

  if (req.method === "POST") {
    try {
      if (!me?.userId) {
        return res.status(401).end();
      }

      const response = await followService.followUser({
        followingUserId: req.query.id,
        followerUserId: me.userId,
      });

      await activityService.addFollowActivity({
        ownerId: req.query.id,
        authorId: me.userId,
        followFollowerId: response.followerId,
        followFollowingId: response.followingId,
      });

      return res.json(response);
    } catch (error) {
      return res.end(processErrorResponse(error));
    }
  }
});
