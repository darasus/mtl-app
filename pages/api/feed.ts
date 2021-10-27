import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { FeedService } from "../../lib/api/FeedService";
import { getUserSession } from "../../lib/getUserSession";
import { FeedType } from "../../types/FeedType";
import { MeSession } from "../../types/MeSession";

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
    const user = await getUserSession({ req });
    const feedService = new FeedService();

    if (feedType === FeedType.Following) {
      const feed = await feedService.fetchFollowingFeed({
        userId: user?.id,
        take: Number(req.query.take) || undefined,
        cursor: Number(req.query.cursor) || undefined,
      });

      return res.send(feed);
    }

    if (feedType === FeedType.Latest) {
      const feed = await feedService.fetchLatestFeed({
        userId: user?.id,
        take: Number(req.query.take) || undefined,
        cursor: Number(req.query.cursor) || undefined,
      });

      return res.send(feed);
    }
  } catch (error) {
    return res.end(error);
  }
}
