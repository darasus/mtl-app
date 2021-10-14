import type { NextApiRequest, NextApiResponse } from "next";
import invariant from "invariant";
import { CommentService } from "../../../../services/api/CommentService";
import { UserSessionService } from "../../../../services/api/UserSessionService";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  try {
    const user = await new UserSessionService({ req }).get();

    if (!user?.id) {
      return res.status(401);
    }

    const postService = new CommentService();
    await postService.addComment({
      content: String(req.body.content),
      postId: Number(req.query.id),
      userId: user.id,
    });
    res.json({ status: "success" });
  } catch (error) {
    return error;
  }
}
