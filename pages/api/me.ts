import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { getUserSession } from "../../lib/getUserSession";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  try {
    const user = await getUserSession({ req });
    res.send(user);
  } catch (error) {
    return res.end(error);
  }
}
