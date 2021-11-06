import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { PostService } from "../../../lib/prismaServices/PostService";
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

  invariant(req.body.title, "title is required.");
  invariant(req.body.content, "content is required.");
  invariant(req.body.codeLanguage, "codeLanguage is required.");
  invariant(typeof req.body.tagId === "number", "tagId is required.");
  invariant(
    typeof req.body.isPublished === "boolean",
    "isPublished is required."
  );

  const userId = String(req.session.userId);

  try {
    const postService = new PostService();
    const post = await postService.createPost(userId, {
      ...req.body,
      tagId: String(req.body.tagId),
    });
    res.json(post);
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
});
