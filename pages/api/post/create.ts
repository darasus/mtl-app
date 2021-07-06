import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { PostService } from "../../../services/api/PostService";

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
    return res.status(401);
  }

  try {
    const postService = new PostService({ req });
    await postService.createPost();
    res.json({ status: "success" });
  } catch (error) {
    return error;
  }
}
