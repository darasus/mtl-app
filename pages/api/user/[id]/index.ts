import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { UserService } from "../../../../services/api/UserService";

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
    const userService = new UserService({ session });
    const user = await userService.getUserById(Number(req.query.id));
    res.json(user);
  } catch (error) {
    return error;
  }
}
