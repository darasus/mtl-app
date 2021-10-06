import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import prisma from "../../../../lib/prisma";
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

  const session = await getSession({ req });

  if (!session) {
    return res
      .status(401)
      .json({ hasError: true, status: 401, message: "Session is not found" });
  }

  try {
    let userId = undefined;
    if (session) {
      const userService = await new UserSessionService(session).get();
      userId = userService.id;
    }
    const postService = new PostService();
    const likeService = new LikeService({ session });
    const post = await postService.fetchPost(Number(req.query.id), userId);

    if (post?.isLikedByMe) {
      res.status(400).json({ message: "Post is already liked by you" });
    }

    await likeService.likePost(Number(req.query.id));
    res.json({ status: "success" });
  } catch (error) {
    return error;
  }
}
