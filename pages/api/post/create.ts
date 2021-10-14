import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { PostService } from "../../../services/api/PostService";
import { UserSessionService } from "../../../services/api/UserSessionService";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  try {
    const userService = await new UserSessionService({ req }).get();
    const userId = userService.id;
    invariant(userId, "userId is undefined");
    const postService = new PostService();
    const post = await postService.createPost(
      {
        title: req.body.title,
        content: req.body.content,
        description: req.body.description,
      },
      userId
    );
    res.json(post);
  } catch (error) {
    return error;
  }
}
