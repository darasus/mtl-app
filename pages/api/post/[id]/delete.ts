import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import prisma from "../../../../lib/prisma";
import { PostService } from "../../../../services/api/PostService";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "DELETE",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  try {
    const postService = new PostService();
    await postService.deletePost(Number(req.query.id));
    res.json({ status: "success" });
  } catch (error) {
    return error;
  }
}
