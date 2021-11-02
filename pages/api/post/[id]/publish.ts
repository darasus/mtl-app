import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { PostService } from "../../../../lib/prismaServices/PostService";
import { getUserSession } from "../../../../lib/getUserSession";
import { processErrorResponse } from "../../../../utils/error";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "PUT",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  try {
    const user = await getUserSession({ req });

    if (!user?.id) {
      return res.status(401).end();
    }

    const postService = new PostService();
    await postService.publishPost(Number(req.query.id));
    res.json({ status: "success" });
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
}
