import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { PostService } from "../../../../services/api/PostService";
import { UserSessionService } from "../../../../services/api/UserSessionService";

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
    const postService = new PostService();
    const post = await postService.fetchPost(Number(req.query.id), userId);
    res.json(post);
  } catch (error) {
    return error;
  }
}
