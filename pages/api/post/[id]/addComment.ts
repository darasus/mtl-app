import type { NextApiRequest, NextApiResponse } from "next";
import invariant from "invariant";
import { CommentService } from "../../../../lib/api/CommentService";
import { getUserSession } from "../../../../lib/getUserSession";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  try {
    const user = await getUserSession({ req });

    if (!user?.id) {
      return res.status(401).end();
    }

    const postService = new CommentService();
    await postService.addComment({
      content: String(req.body.content),
      postId: Number(req.query.id),
      userId: user.id,
    });
    res.json({ status: "success" });
  } catch (error) {
    return res.end(error);
  }
}
