import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserService } from "../../../../lib/prismaServices/UserService";
import { getUserSession } from "../../../../lib/getUserSession";
import { processErrorResponse } from "../../../../utils/error";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof req.query.id === "string", "User ID is not provided");
  const userId = req.query.id;

  try {
    const me = getUserSession(req);
    const userService = new UserService();
    const posts = await userService.getUserPosts(userId, me?.id === userId);
    res.json(posts);
  } catch (error) {
    return res.status(400).end(processErrorResponse(error));
  }
}
