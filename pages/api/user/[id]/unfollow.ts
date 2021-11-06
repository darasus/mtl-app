import { requireSession, RequireSessionProp } from "@clerk/nextjs/api";
import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { ActivityService } from "../../../../lib/prismaServices/ActivityService";
import { FollowService } from "../../../../lib/prismaServices/FollowService";
import { processErrorResponse } from "../../../../utils/error";

export default requireSession(async function handle(
  req: RequireSessionProp<NextApiRequest>,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof req.query.id === "string", "User ID is not provided");

  const userId = String(req.query.id);
  const meId = String(req.session.userId);
  const activityService = new ActivityService();
  const followService = new FollowService();

  try {
    await activityService.removeFollowActivity({
      followFollowingId: userId,
      followFollowerId: meId,
    });

    await followService.unfollowUser({
      followingUserId: userId,
      followerUserId: meId,
    });
    return res.status(200).end();
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
});
