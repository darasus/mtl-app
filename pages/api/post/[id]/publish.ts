import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { PostService } from "../../../../lib/prismaServices/PostService";
import { processErrorResponse } from "../../../../utils/error";
import { requireSession, RequireSessionProp } from "@clerk/nextjs/api";

export default requireSession(async function handle(
  req: RequireSessionProp<NextApiRequest>,
  res: NextApiResponse
) {
  invariant(
    req.method === "PUT",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  try {
    const postService = new PostService();
    await postService.publishPost(String(req.query.id));
    res.json({ status: "success" });
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
});
