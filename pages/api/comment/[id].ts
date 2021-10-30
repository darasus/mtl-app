import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { ActivityService } from "../../../lib/api/ActivityService";
import { CommentService } from "../../../lib/api/CommentService";
import { PostService } from "../../../lib/api/PostService";
import { getUserSession } from "../../../lib/getUserSession";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "DELETE",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  const commentId = Number(req.query.id);
  const commentService = new CommentService();
  const postService = new PostService();
  const activityService = new ActivityService();

  try {
    const user = await getUserSession({ req });

    if (!user?.id) {
      return res.status(401).end();
    }

    const isMyComment = await commentService.isMyComment({
      commentId: Number(req.query.id),
      userId: user.id,
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
      ownerId: user.id,
    });
    await commentService.deleteComment(Number(req.query.id), post.id);
    res.json({ status: "success" });
  } catch (error) {
    return res.end(error);
  }
}
