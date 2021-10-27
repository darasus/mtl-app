import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
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

  try {
    const user = await getUserSession({ req });

    if (!user?.id) {
      return res.status(401).end();
    }

    const commentService = new CommentService();
    const postService = new PostService();

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

    const post = await postService.findPostByCommentId(Number(req.query.id));

    if (!post) return null;

    await commentService.deleteComment(Number(req.query.id), post.id);
    res.json({ status: "success" });
  } catch (error) {
    return res.end(error);
  }
}
