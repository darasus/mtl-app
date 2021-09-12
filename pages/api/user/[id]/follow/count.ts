import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { FollowService } from "../../../../../services/api/FollowService";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  const session = await getSession({ req });

  try {
    const followService = new FollowService({ session });
    const count = await followService.getNumberOfFollowers(
      Number(req.query.id)
    );
    res.json(count);
  } catch (error) {
    return error;
  }
}
