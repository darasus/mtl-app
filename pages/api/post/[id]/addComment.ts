import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import invariant from "invariant";
import { CommentService } from "../../../../services/api/CommentService";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  const session = await getSession({ req });

  if (!session) {
    return res.status(401);
  }

  if (!session?.user?.email) {
    return res.status(401);
  }

  try {
    const postService = new CommentService({ session });
    await postService.addComment({
      content: String(req.body.content),
      postId: Number(req.query.id),
    });
    res.json({ status: "success" });
  } catch (error) {
    return error;
  }
}
