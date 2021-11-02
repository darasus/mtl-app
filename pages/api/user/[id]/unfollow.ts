import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { ActivityService } from "../../../../lib/api/ActivityService";
import { FollowService } from "../../../../lib/api/FollowService";
import { getUserSession } from "../../../../lib/getUserSession";
import { processErrorResponse } from "../../../../utils/error";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof req.query.id === "string", "User ID is not provided");

  const activityService = new ActivityService();
  const followService = new FollowService();

  try {
    const user = await getUserSession({ req });

    if (!user?.id) {
      return res.status(401).end();
    }

    await activityService.removeFollowActivity({
      followFollowingId: Number(req.query.id),
      followFollowerId: user.id,
    });

    await followService.unfollowUser({
      followingUserId: Number(req.query.id),
      followerUserId: user.id,
    });
    return res.status(200).end();
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
}
