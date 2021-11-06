import type { NextApiRequest, NextApiResponse } from "next";
import { PostService } from "../../../lib/prismaServices/PostService";
import invariant from "invariant";
import { processErrorResponse } from "../../../utils/error";
import { requireSession, RequireSessionProp } from "@clerk/nextjs/api";

export default requireSession(async function handle(
  req: RequireSessionProp<NextApiRequest>,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  const userId = String(req.session.userId);

  try {
    const postService = new PostService();
    await postService.savePost(
      {
        title: req.body.title,
        content: req.body.content,
        description: req.body.description,
      },
      userId
    );
    res.json({ status: "success" });
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
});
