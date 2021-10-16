import invariant from "invariant";
import type { NextApiRequest, NextApiResponse } from "next";
import chrome from "chrome-aws-lambda";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  invariant(
    req.method === "GET",
    `The HTTP ${req.method} method is not supported at this route.`
  );
  invariant(typeof req.query.url === "string", "url param is not provided");

  console.log(req.query.url);

  const isLocalhost = req.headers.host === "localhost:3000";
  const browser = await (isLocalhost ? puppeteer : puppeteerCore).launch({
    headless: true,
    ...(isLocalhost
      ? {}
      : { args: chrome.args, executablePath: await chrome.executablePath }),
  });
  const page = await browser.newPage();

  await page.setViewport({
    width: Number(req.query.width) || 1200,
    height: Number(req.query.height) || 630,
  });

  await page.goto(
    req.query.url,
    isLocalhost
      ? {
          waitUntil: "networkidle2",
        }
      : {
          waitUntil: "networkidle0",
        }
  );

  const screenshot = await page.screenshot({
    type: "png",
    encoding: "binary",
    captureBeyondViewport: true,
    fullPage: true,
  });

  res.statusCode = 200;
  return res.end(screenshot);
}
