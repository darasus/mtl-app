import type { NextApiRequest, NextApiResponse } from "next";
import invariant from "invariant";
import { PostService } from "../../../../lib/prismaServices/PostService";
import { LikeService } from "../../../../lib/prismaServices/LikeService";
import cache from "../../../../lib/cache";
import { ActivityService } from "../../../../lib/prismaServices/ActivityService";
import { redisCacheKey } from "../../../../lib/RedisCacheKey";
import { processErrorResponse } from "../../../../utils/error";
import { requireSession, RequireSessionProp } from "@clerk/nextjs/api";

export default requireSession(async function handle(
  req: RequireSessionProp<NextApiRequest>,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  const userId = String(req.session?.userId);

  try {
    const postService = new PostService();
    const likeService = new LikeService();
    const activityService = new ActivityService();
    const post = await postService.fetchPost(String(req.query.id), userId);

    if (!post) {
      return res.json({ status: "failure" });
    }

    if (post?.isLikedByMe) {
      return res.status(400).json({ message: "Post is already liked by you" });
    }

    const like = await likeService.likePost(String(req.query.id), userId);
    await cache.del(redisCacheKey.createPostKey(post.id));
    await activityService.addLikeActivity({
      authorId: userId,
      likeId: like.id,
      ownerId: post.authorId as string,
      postId: post.id,
    });
    res.json({ status: "success" });
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
});
