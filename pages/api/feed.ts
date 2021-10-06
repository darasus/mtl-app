import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { FeedService } from "../../services/api/FeedService";
import { PostService } from "../../services/api/PostService";
import { UserSessionService } from "../../services/api/UserSessionService";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  const session = await getSession({ req });

  try {
    let userId = undefined;
    if (session) {
      const userService = await new UserSessionService(session).get();
      userId = userService.id;
    }
    const feedService = new FeedService();
    const feed = await feedService.fetchFeed({
      userId,
      take: Number(req.query.take) || undefined,
      cursor: Number(req.query.cursor) || undefined,
    });
    res.send(feed);
  } catch (error) {
    return error;
  }
}
