import type { NextApiRequest, NextApiResponse } from "next";
import invariant from "invariant";
import { CommentService } from "../../../../lib/prismaServices/CommentService";
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
  invariant(typeof Number(req.query.id) === "number", "Comment id is missing");

  const userId = req.session?.userId || undefined;

  try {
    const postService = new CommentService();
    const comments = await postService.getCommentsByPostId({
      postId: String(req.query.id),
      take: Number(req.query.take) || undefined,
      skip: Number(req.query.cursor) || undefined,
      userId,
    });
    res.json(comments);
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
});
