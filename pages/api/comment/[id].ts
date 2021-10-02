import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { CommentService } from "../../../services/api/CommentService";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "DELETE",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  const session = await getSession({ req });

  if (!session) {
    res.status(401);
  }

  try {
    const commentService = new CommentService({ session });

    const isMyComment = await commentService.isMyComment(Number(req.query.id));

    console.log(isMyComment);

    if (!isMyComment) {
      return res.status(403).send({
        status: 403,
        hasError: true,
        message: "You can only delete your own comments",
      });
    }

    await commentService.deleteComment(Number(req.query.id));
    res.json({ status: "success" });
  } catch (error) {
    return error;
  }
}
