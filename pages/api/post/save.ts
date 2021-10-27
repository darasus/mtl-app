import type { NextApiRequest, NextApiResponse } from "next";
import { PostService } from "../../../lib/api/PostService";
import invariant from "invariant";
import { getUserSession } from "../../../lib/getUserSession";

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

    const postService = new PostService();
    await postService.savePost(
      {
        title: req.body.title,
        content: req.body.content,
        description: req.body.description,
      },
      user.id
    );
    res.json({ status: "success" });
  } catch (error) {
    return res.end(error);
  }
}
