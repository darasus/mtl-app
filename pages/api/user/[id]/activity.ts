import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserService } from "../../../../lib/api/UserService";
import { processErrorResponse } from "../../../../utils/error";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof req.query.id === "string", "User ID is not provided");

  try {
    const userService = new UserService();
    const response = await userService.getUserActivity({
      userId: Number(req.query.id),
      take: Number(req.query.take) || undefined,
      cursor: Number(req.query.cursor) || undefined,
    });
    res.json(response);
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
}
