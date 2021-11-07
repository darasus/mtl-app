import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { FeedService } from "../../lib/prismaServices/FeedService";
import { getUserSession } from "../../lib/getUserSession";
import { FeedType } from "../../types/FeedType";
import { processErrorResponse } from "../../utils/error";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(
    typeof req.query.feedType === "string",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  const feedType = req.query.feedType as FeedType;

  try {
    const user = getUserSession(req);
    const feedService = new FeedService();
    const props = {
      userId: user?.id,
      take: Number(req.query.take) || undefined,
      cursor: Number(req.query.cursor) || undefined,
    };

    if (feedType === FeedType.Following) {
      const feed = await feedService.fetchFollowingFeed(props);
      return res.send(feed);
    }

    if (feedType === FeedType.Latest) {
      const feed = await feedService.fetchLatestFeed(props);
      return res.send(feed);
    }
  } catch (error) {
    return res.status(400).end(processErrorResponse(error));
  }
}
