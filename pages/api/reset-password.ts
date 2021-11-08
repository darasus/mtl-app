import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { transporter } from "../../lib/transporter";
import prisma from "../../lib/prisma";
import { AuthService } from "../../lib/prismaServices/AuthService";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof req.body.email === "string", "email is missing");

  const authService = new AuthService({ prisma, transporter });

  await authService.resetPassword(req.body.email);

  res.status(200).json({ status: "ok" });
}
