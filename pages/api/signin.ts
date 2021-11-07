import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { processErrorResponse } from "../../utils/error";
import { AuthService } from "../../lib/prismaServices/AuthService";
import { supabase } from "../../lib/supabase";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "POST",
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

    const response = await authService.signIn({
      email: req.body.email,
      password: req.body.password,
    });
    if (response.error) {
      return res.status(response.error.status).json(response.error.message);
    }
    res.json(response);
    // if (response.session) {
    //   supabase.auth.api.setAuthCookie(
    //     {
    //       ...req,
    //       headers: req.headers,
    //       body: { session: response.session, event: "SIGNED_IN" },
    //     },
    //     res
    //   );
    // }
  } catch (error) {
    return res.status(400).end(processErrorResponse(error));
  }
}
