import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserService } from "../../../../lib/api/UserService";
import { getUserSession } from "../../../../lib/getUserSession";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof req.query.id === "string", "User ID is not provided");

  try {
    const me = await getUserSession({ req });
    const userService = new UserService();
    const userId = Number(req.query.id);
    const posts = await userService.getUserPosts(userId, me?.id === userId);
    res.json(posts);
  } catch (error) {
    return res.end(error);
  }
}
