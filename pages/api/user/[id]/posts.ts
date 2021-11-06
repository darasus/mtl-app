import { withSession, WithSessionProp } from "@clerk/nextjs/api";
import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserService } from "../../../../lib/prismaServices/UserService";
import { processErrorResponse } from "../../../../utils/error";

export default withSession(async function handle(
  req: WithSessionProp<NextApiRequest>,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof req.query.id === "string", "User ID is not provided");

  const userId = String(req.query.id);
  const meId = String(req.session?.userId);

  try {
    const userService = new UserService();
    const posts = await userService.getUserPosts(userId, meId === userId);
    res.json(posts);
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
});
