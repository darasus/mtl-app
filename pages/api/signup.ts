import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { processErrorResponse } from "../../utils/error";
import { AuthService } from "../../lib/prismaServices/AuthService";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(
    typeof req.body.firstName === "string",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(
    typeof req.body.lastName === "string",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(
    typeof req.body.email === "string",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(
    typeof req.body.password === "string",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  try {
    const authService = new AuthService();

    const response = await authService.signUp(
      {
        email: req.body.email,
        password: req.body.password,
      },
      {
        data: {
          first_name: req.body.firstName,
          last_name: req.body.lastName,
        },
      }
    );
    return res.json(response);
  } catch (error) {
    return res.status(400).end(processErrorResponse(error));
  }
}
