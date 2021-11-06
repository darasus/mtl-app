import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { ActivityService } from "../../../../lib/prismaServices/ActivityService";
import { processErrorResponse } from "../../../../utils/error";
import { requireSession, RequireSessionProp } from "@clerk/nextjs/api";

export default requireSession(async function handle(
  req: RequireSessionProp<NextApiRequest>,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof req.query.id === "string", "Activity ID is not provided");

  const activityService = new ActivityService();

  try {
    const activity = await activityService.markActivityAsRead({
      activityId: String(req.query.id),
    });
    return res.json(activity);
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
});
