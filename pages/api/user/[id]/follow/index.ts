import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { FollowService } from "../../../../../lib/api/FollowService";
import { UserSessionService } from "../../../../../lib/api/UserSessionService";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(typeof req.query.id === "string", "User ID is not provided");
  invariant(
    req.method === "POST" || req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  if (req.method === "GET") {
    try {
      const user = await new UserSessionService({ req }).get();

      if (!user?.id) {
        return res.status(401);
      }

      const followService = new FollowService();
      const response = await followService.doIFollow(
        Number(req.query.id),
        user.id
      );
      return res.json({ doIFollow: response.doIFollow });
    } catch (error) {
      return error;
    }
  }

  if (req.method === "POST") {
    try {
      const user = await new UserSessionService({ req }).get();

      if (!user?.id) {
        return res.status(401);
      }

      const followService = new FollowService();
      await followService.followUser(Number(req.query.id), user.id);
      return res.json({ status: "success" });
    } catch (error) {
      return error;
    }
  }
}
