import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { UserService } from "../../../../../services/api/UserService";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(typeof req.query?.id === "string", "User ID is not provided");
  invariant(
    req.method === "POST" || req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  const session = await getSession({ req });

  if (req.method === "GET") {
    try {
      const userService = new UserService({ session });
      const followingUserId = Number(req.query.id);
      const response = await userService.doIFollow(followingUserId);
      res.json({ doIFollow: response.doIFollow });
    } catch (error) {
      return error;
    }
  }

  if (req.method === "POST") {
    try {
      const userService = new UserService({ session });
      const followingUserId = Number(req.query.id);
      await userService.followUser(followingUserId);
      res.json({ status: "success" });
    } catch (error) {
      return error;
    }
  }
}
