import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { FollowService } from "../../../../../services/api/FollowService";
import { UserSessionService } from "../../../../../services/api/UserSessionService";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(typeof req.query.id === "string", "User ID is not provided");
  invariant(
    req.method === "POST" || req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  let session = await getSession({ req });

  if (req.method === "GET") {
    if (!session) {
      return res.json({ doIFollow: false });
    }

    try {
      const user = await new UserSessionService(session).get();
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
    if (!session) {
      return res.status(401).json({
        status: 401,
        hasError: true,
        message: "Session is not found",
      });
    }

    try {
      const user = await new UserSessionService(session).get();
      const followService = new FollowService();
      await followService.followUser(Number(req.query.id), user.id);
      return res.json({ status: "success" });
    } catch (error) {
      return error;
    }
  }
}
