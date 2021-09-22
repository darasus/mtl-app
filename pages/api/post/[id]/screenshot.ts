import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
const chrome = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );

  let browser = null;
  browser = await puppeteer.launch({
    headless: true,
    args: chrome.args,
    executablePath: await chrome.executablePath,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630 });
  await page.goto(`${process.env.NEXTAUTH_URL}/p/${req.query.id}/preview`, {
    waitUntil: "networkidle0",
  });
  const screenshot = await page.screenshot({
    type: "png",
    encoding: "binary",
  });
  res.statusCode = 200;
  res.setHeader("Content-Type", "image/png");
  return res.end(screenshot);
}
