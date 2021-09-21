import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  let browser = null;

  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630 });
    await page.goto(`http://localhost:3000/p/${req.query.id}/preview`);
    await page.waitForSelector('[data-testid="post-title"]');
    await page.waitFor(100);
    const screenshot = await page.screenshot({
      type: "png",
      path: "./screenshot.png",
      encoding: "binary",
    });
    res.statusCode = 200;
    res.setHeader("Content-Type", "image/png");
    return res.end(screenshot);
  } catch (error) {
    return res.status(500).send(error);
  }
}
