import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { ActivityService } from "../../../lib/api/ActivityService";
import { getUserSession } from "../../../lib/getUserSession";
import { processErrorResponse } from "../../../utils/error";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  const activityService = new ActivityService();

  try {
    const user = await getUserSession({ req });

    if (!user?.id) {
      return res.status(401).end();
    }

    const activity = await activityService.markAllActivityAsRead({
      userId: user.id,
    });
    return res.json(activity);
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
}
