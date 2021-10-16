import chrome from "chrome-aws-lambda";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";
import cache from "../cache";
import { createUseScreenshotQueryCacheKey } from "../../hooks/query/useScreenshotQuery";

interface ScreenshotProps {
  isLocalhost?: boolean;
  url: string;
  width?: number;
  height?: number;
}

export class ScreenshotService {
  async makeScreenshot({
    isLocalhost,
    url,
    width = 1200,
    height = 630,
  }: ScreenshotProps): Promise<any> {
    const browser = await (isLocalhost ? puppeteer : puppeteerCore).launch({
      headless: true,
      ...(isLocalhost
        ? {}
        : { args: chrome.args, executablePath: await chrome.executablePath }),
    });
    const page = await browser.newPage();
    await page.setViewport({ width, height });

    await page.goto(
      url,
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

    return screenshot;
  }

  async screenshot(data: ScreenshotProps) {
    const response = await cache.fetch(
      JSON.stringify(createUseScreenshotQueryCacheKey(data.url)),
      () => this.makeScreenshot(data),
      60 * 60 * 24
    );

    const buffer = new Buffer(response, "base64");

    return buffer;
  }
}
