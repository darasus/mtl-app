import type { NextApiRequest, NextApiResponse } from "next";
import invariant from "invariant";
import { CommentService } from "../../../../lib/prismaServices/CommentService";
import { ActivityService } from "../../../../lib/prismaServices/ActivityService";
import { PostService } from "../../../../lib/prismaServices/PostService";
import { processErrorResponse } from "../../../../utils/error";
import { requireSession, RequireSessionProp } from "@clerk/nextjs/api";

export default requireSession(async function handle(
  req: RequireSessionProp<NextApiRequest>,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  const postId = String(req.query.id);
  const userId = String(req.session.userId);
  const postService = new PostService();
  const activityService = new ActivityService();
  const commentService = new CommentService();

  try {
    const comment = await commentService.addComment({
      content: String(req.body.content),
      postId,
      userId,
    });
    const post = await postService.fetchPost(postId);
    await activityService.addCommentActivity({
      postId,
      authorId: userId,
      commentId: comment.id,
      ownerId: post?.authorId as string,
    });
    res.json({ status: "success" });
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
});
