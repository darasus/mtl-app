import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { FeedService } from "../../lib/prismaServices/FeedService";
import { FeedType } from "../../types/FeedType";
import { processErrorResponse } from "../../utils/error";
import { WithSessionProp, withSession } from "@clerk/nextjs/api";

export default withSession(async function handle(
  req: WithSessionProp<NextApiRequest>,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(
    typeof req.query.feedType === "string",
    `feedType query is required`
  );

  const feedType = req.query.feedType as FeedType;
  const userId = req.session?.userId || undefined;
  const cursor = (req.query.cursor as string) || undefined;
  const take = Number(req.query.take) || undefined;

  try {
    const feedService = new FeedService();

    if (feedType === FeedType.Following) {
      const feed = await feedService.fetchFollowingFeed({
        userId,
        take,
        cursor,
      });

      return res.end(feed);
    }

    const feed = await feedService.fetchLatestFeed({
      userId,
      take,
      cursor,
    });

    return res.json(feed);
  } catch (error) {
    console.error(error);
    return res.end(processErrorResponse(error));
  }
});
