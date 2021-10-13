import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import invariant from "invariant";
import { PostService } from "../../../../services/api/PostService";
import { CommentService } from "../../../../services/api/CommentService";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof Number(req.query.id) === "number", "Comment id is missing");

  try {
    const postService = new CommentService({});
    const comments = await postService.getCommentsByPostId({
      postId: Number(req.query.id),
      take: Number(req.query.take) || undefined,
      skip: Number(req.query.cursor) || undefined,
    });
    res.json(comments);
  } catch (error) {
    return error;
  }
}
