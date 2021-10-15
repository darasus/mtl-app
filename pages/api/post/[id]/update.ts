import type { NextApiRequest, NextApiResponse } from "next";
import invariant from "invariant";
import { PostService } from "../../../../lib/api/PostService";
import { UserSessionService } from "../../../../lib/api/UserSessionService";

export default async function handle(
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
    const user = await new UserSessionService({ req }).get();

    if (!user?.id) {
      return res.status(401);
    }

    const postService = new PostService();
    const post = await postService.updatePost(
      {
        title: req.body.title,
        content: req.body.content,
        description: req.body.description,
        codeLanguage: req.body.codeLanguage,
        tagId: Number(req.body.tagId),
      },
      Number(req.query.id)
    );
    res.json(post);
  } catch (error) {
    return error;
  }
}
