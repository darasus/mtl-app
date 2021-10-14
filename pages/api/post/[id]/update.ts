import type { NextApiRequest, NextApiResponse } from "next";
import invariant from "invariant";
import { PostService } from "../../../../services/api/PostService";
import { UserSessionService } from "../../../../services/api/UserSessionService";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "PUT",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  try {
    const user = await new UserSessionService({ req }).get();

    if (!user?.id) {
      return res.status(401);
    }

    const postService = new PostService();
    await postService.updatePost(
      {
        title: req.body.title,
        content: req.body.content,
        description: req.body.description,
      },
      Number(req.query.id)
    );
    res.json({ status: "success" });
  } catch (error) {
    return error;
  }
}
