import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { PostService } from "../../services/api/PostService";
import { Post } from "../../types/Post";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    invariant(
      req.method === "GET",
      `The HTTP ${req.method} method is not supported at this route.`
    );
    const postService = new PostService({ req });
    const feed: Post[] = await postService.fetchFeed();
    res.status(200);
    res.send(feed);
  } catch (error) {}
}
