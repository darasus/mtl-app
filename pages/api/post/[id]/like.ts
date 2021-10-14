import type { NextApiRequest, NextApiResponse } from "next";
import invariant from "invariant";
import { PostService } from "../../../../services/api/PostService";
import { LikeService } from "../../../../services/api/LikeService";
import { UserSessionService } from "../../../../services/api/UserSessionService";
import cache from "../../../../server/cache";
import { createUsePostQueryCacheKey } from "../../../../hooks/query/usePostQuery";

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

    if (!user) return null;

    const postService = new PostService();
    const likeService = new LikeService();
    const post = await postService.fetchPost(Number(req.query.id), user.id);

    if (!post) {
      return res.json({ status: "failure" });
    }

    if (post?.isLikedByMe) {
      return res.status(400).json({ message: "Post is already liked by you" });
    }

    await likeService.likePost(Number(req.query.id), user.id);
    await cache.del(JSON.stringify(createUsePostQueryCacheKey(post.id)));
    res.json({ status: "success" });
  } catch (error) {
    return res.end(error);
  }
}
