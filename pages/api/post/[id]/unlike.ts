import type { NextApiRequest, NextApiResponse } from "next";
import invariant from "invariant";
import { PostService } from "../../../../lib/prismaServices/PostService";
import { LikeService } from "../../../../lib/prismaServices/LikeService";
import cache from "../../../../lib/cache";
import { getUserSession } from "../../../../lib/getUserSession";
import { ActivityService } from "../../../../lib/prismaServices/ActivityService";
import { redisCacheKey } from "../../../../lib/RedisCacheKey";
import { processErrorResponse } from "../../../../utils/error";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  const postId = Number(req.query.id);

  try {
    const user = await getUserSession({ req });
    if (!user) return null;
    const postService = new PostService();
    const likeService = new LikeService();
    const activityService = new ActivityService();
    const post = await postService.fetchPost(postId, user.id);

    if (!post) {
      return res.json({ status: "failure" });
    }

    if (!post?.isLikedByMe) {
      return res.status(400).json({ message: "Post is not liked by you yet" });
    }

    await activityService.removeLikeActivity({
      postId,
      authorId: user.id,
      ownerId: post?.authorId as string,
    });
    await likeService.unlikePost(postId, user.id);
    await cache.del(redisCacheKey.createPostKey(postId));
    res.json({ status: "success" });
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
}
