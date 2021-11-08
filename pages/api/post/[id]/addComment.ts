import type { NextApiRequest, NextApiResponse } from "next";
import invariant from "invariant";
import { CommentService } from "../../../../lib/prismaServices/CommentService";
import { getUserSession } from "../../../../lib/getUserSession";
import { ActivityService } from "../../../../lib/prismaServices/ActivityService";
import { PostService } from "../../../../lib/prismaServices/PostService";
import { processErrorResponse } from "../../../../utils/error";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  const postId = Number(req.query.id);
  const postService = new PostService();
  const activityService = new ActivityService();
  const commentService = new CommentService();

  try {
    const user = await getUserSession({ req });

    if (!user?.id) {
      return res.status(401).end();
    }

    const comment = await commentService.addComment({
      content: String(req.body.content),
      postId,
      userId: user.id,
    });
    const post = await postService.fetchPost(postId);
    await activityService.addCommentActivity({
      postId,
      authorId: user.id,
      commentId: comment.id,
      ownerId: post?.authorId as string,
    });
    res.json({ status: "success" });
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
}
