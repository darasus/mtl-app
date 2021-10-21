import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
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

  try {
    const user = await new UserSessionService({ req }).get();

    if (!user?.id) {
      return res.status(401).end();
    }

    const postService = new PostService();
    await postService.unpublishPost(Number(req.query.id));
    res.json({ status: "success" });
  } catch (error) {
    return res.end(error);
  }
}
