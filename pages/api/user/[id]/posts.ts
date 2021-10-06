import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { PostService } from "../../../../services/api/PostService";
import { UserService } from "../../../../services/api/UserService";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  try {
    const userService = new UserService();
    const posts = await userService.getUserPosts(Number(req.query.id));
    res.json(posts);
  } catch (error) {
    return error;
  }
}
