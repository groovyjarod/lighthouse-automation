import puppeteer from "puppeteer";
import lighthouse from "lighthouse";
import secretUserAgent from "./secretUserAgent.mjs";
import { URL } from "url";

const OUTPUT_FORMAT = "json";
const TESTING_METHOD = "desktop";
const isMobile = TESTING_METHOD === "mobile";
const USER_AGENT = secretUserAgent();
const LOADING_TIME = 5000;

const viewport = isMobile
  ? { width: 500, height: 700 }
  : { width: 1400, height: 800 };

if (
  USER_AGENT === "replace this return value with the provided secret user agent"
) {
  console.error(
    "Please go to secretUserAgent.mjs and replace the return value with the secret user-agent key provided."
  );
  process.exit(1);
}

export default async function generatePuppeteerAudit(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      `--user-agent=${USER_AGENT}`
    ],
  });

  const page = await browser.newPage();

  const ip = await page.evaluate(async () => {
    const res = await fetch('https://api.ipify.org?format=json')
    const data = await res.json()
    return data.ip
  })

  await page.setViewport({...viewport, deviceScaleFactor: 1})
  await page.goto(url, { waitUntil: "networkidle2", timeout: LOADING_TIME });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); // scroll to bottom for lazy loads
  await new Promise((r) => setTimeout(r, 1000));

  const wsEndpoint = browser.wsEndpoint();
  const endpointURL = new URL(wsEndpoint);

  const options = {
    port: endpointURL.port,
    output: OUTPUT_FORMAT,
    logLevel: 'info',
  }

  const config = {
    extends: 'lighthouse:default',
    settings: {
        formFactor: TESTING_METHOD,
        screenEmulation: {
            mobile: isMobile,
            width: viewport.width,
            height: viewport.height,
            deviceScaleFactor: 1,
            disabled: false,
        },
        onlyCategories: ['accessibility'],
        pauseAfterFcpMs: 3000,
        maxWaitForLoad: LOADING_TIME,
        emulatedUserAgent: USER_AGENT,
    }
  }

  const runResult = await lighthouse(url, options, config);

  const report = runResult.report;
  const accessibilityScore = runResult.lhr.categories.accessibility.score * 100
  await browser.close();
  return [report, accessibilityScore]
}

// generatePuppeteerAudit("https://www.familysearch.org/en/wiki/New_York_Online_Genealogy_Records")