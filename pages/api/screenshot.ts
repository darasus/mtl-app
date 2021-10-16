import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import { ScreenshotService } from "../../lib/api/ScreenshotService";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof req.query.url === "string", "url param is not provided");

  const isLocalhost = req.headers.host === "localhost:3000";
  const screenshotService = new ScreenshotService();
  const screenshot = await screenshotService.screenshot({
    isLocalhost,
    url: req.query.url,
    width: Number(req.query.width) || undefined,
    height: Number(req.query.height) || undefined,
  });

  return res.status(200).end(screenshot);
}
