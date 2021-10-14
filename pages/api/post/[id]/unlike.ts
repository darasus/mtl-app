import type { NextApiRequest, NextApiResponse } from "next";
import invariant from "invariant";
import { PostService } from "../../../../services/api/PostService";
import { LikeService } from "../../../../services/api/LikeService";
import { UserSessionService } from "../../../../services/api/UserSessionService";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  try {
    const user = await new UserSessionService({ req }).get();
    const postService = new PostService();
    const likeService = new LikeService();
    const post = await postService.fetchPost(Number(req.query.id), user.id);

    if (!post?.isLikedByMe) {
      res.status(400).json({ message: "Post is not liked by you yet" });
    }

    await likeService.unlikePost(Number(req.query.id), user.id);
    res.json({ status: "success" });
  } catch (error) {
    res.end(error);
  }
}
