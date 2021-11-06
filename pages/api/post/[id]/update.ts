import type { NextApiRequest, NextApiResponse } from "next";
import invariant from "invariant";
import { PostService } from "../../../../lib/prismaServices/PostService";
import { processErrorResponse } from "../../../../utils/error";
import { requireSession } from "@clerk/nextjs/api";

export default requireSession(async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "PUT",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  invariant(req.body.title, "title is required.");
  invariant(req.body.content, "content is required.");
  invariant(req.body.description, "description is required.");
  invariant(req.body.codeLanguage, "codeLanguage is required.");
  invariant(typeof req.body.tagId === "number", "tagId is required.");

  try {
    const postService = new PostService();
    const post = await postService.updatePost(
      {
        title: req.body.title,
        content: req.body.content,
        description: req.body.description,
        codeLanguage: req.body.codeLanguage,
        tagId: String(req.body.tagId),
      },
      String(req.query.id)
    );
    res.json(post);
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
});
