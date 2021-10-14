import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
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

  try {
    const user = await new UserSessionService({ req }).get();
    const postService = new PostService();
    const post = await postService.fetchPost(Number(req.query.id), user?.id);
    res.json(post);
  } catch (error) {
    return error;
  }
}
