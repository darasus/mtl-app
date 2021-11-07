import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { getUserSession } from "../../lib/getUserSession";
import { processErrorResponse } from "../../utils/error";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  try {
    const user = getUserSession(req);
    res.send(user);
  } catch (error) {
    return res.status(400).end(processErrorResponse(error));
  }
}
