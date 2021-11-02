import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { PostService } from "../../../../lib/api/PostService";
import { getUserSession } from "../../../../lib/getUserSession";
import { processErrorResponse } from "../../../../utils/error";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  try {
    const user = await getUserSession({ req });
    const postService = new PostService();
    const post = await postService.fetchPost(Number(req.query.id), user?.id);

    if (!post) {
      return res.status(404).end();
    }

    return res.json(post);
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
}
