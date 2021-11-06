import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserService } from "../../../../lib/prismaServices/UserService";
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

  const userId = req.query.id as string;
  const take = Number(req.query.take) || undefined;
  const cursor = (req.query.cursor as string) || undefined;

  try {
    const userService = new UserService();
    const response = await userService.getUserActivity({
      userId,
      take,
      cursor,
    });
    res.end(response);
  } catch (error) {
    return res.end(processErrorResponse(error));
  }
}
