import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { FeedService } from "../../services/api/FeedService";
import { UserSessionService } from "../../services/api/UserSessionService";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  try {
    const user = await new UserSessionService({ req }).get();
    const feedService = new FeedService();
    const feed = await feedService.fetchFeed({
      userId: user?.id,
      take: Number(req.query.take) || undefined,
      cursor: Number(req.query.cursor) || undefined,
    });
    res.send(feed);
  } catch (error) {
    return error;
  }
}
