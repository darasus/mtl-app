import invariant from "invariant";
import { NextApiRequest, NextApiResponse } from "next";
import { UserService } from "../../../../lib/prismaServices/UserService";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof req.query.id === "string", "id is required");

  const userService = new UserService();

  await userService.updateUserSettings({
    userId: req.query.id,
    image: req.body.image,
    name: req.body.name,
    userName: req.body.userName,
    password: req.body.password,
  });

  return res.json({});
}
