import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { PostService } from "../../../../lib/prismaServices/PostService";
import { processErrorResponse } from "../../../../utils/error";
import { withSession, WithSessionProp } from "@clerk/nextjs/api";

export default withSession(async function handle(
  req: WithSessionProp<NextApiRequest>,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  const userId = String(req.session?.userId);

  try {
    const postService = new PostService();
    const post = await postService.fetchPost(String(req.query.id), userId);

    if (!post) {
      return res.status(404).end();
    }

    return res.json(post);
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
});
