import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { ActivityService } from "../../../lib/prismaServices/ActivityService";
import { CommentService } from "../../../lib/prismaServices/CommentService";
import { PostService } from "../../../lib/prismaServices/PostService";
import { processErrorResponse } from "../../../utils/error";
import { RequireSessionProp, requireSession } from "@clerk/nextjs/api";

export default requireSession(async function handle(
  req: RequireSessionProp<NextApiRequest>,
  res: NextApiResponse
) {
  invariant(
    req.method === "DELETE",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  const commentId = String(req.query.id);
  const userId = String(req.session.userId);
  const commentService = new CommentService();
  const postService = new PostService();
  const activityService = new ActivityService();

  try {
    const isMyComment = await commentService.isMyComment({
      commentId,
      userId,
    });

    if (!isMyComment) {
      return res.status(403).send({
        status: 403,
        hasError: true,
        message: "You can only delete your own comments",
      });
    }

    const post = await postService.findPostByCommentId(commentId);

    if (!post) return null;

    await activityService.removeCommentActivity({
      commentId,
      ownerId: userId,
    });
    await commentService.deleteComment(commentId, post.id);
    res.json({ status: "success" });
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
});
