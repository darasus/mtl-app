import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { PostService } from "../../../lib/prismaServices/PostService";
import { getUserSession } from "../../../lib/getUserSession";
import { processErrorResponse } from "../../../utils/error";

export default async function handle(
  req: NextApiRequest,
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

  try {
    const user = getUserSession(req);

    if (!user?.id) {
      return res.status(401).end();
    }

    const postService = new PostService();
    const post = await postService.createPost(user.id, req.body);
    res.json(post);
  } catch (error) {
    return res.status(400).end(processErrorResponse(error));
  }
}
