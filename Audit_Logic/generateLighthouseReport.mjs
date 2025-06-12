// IMPORTANT!!!!!!!! PLEASE READ BEFORE EXECUTING SCRIPT!!!!
/*
This script requires the insertion of a secret user-agent, which will be provided to anyone authorized to run
automated lighthouse audits for FamilySearch. Please refer to secretUserAgent.mjs for further
instructions.

*/

import secretUserAgent from "./secretUserAgent.mjs";

import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const OUTPUT_FORMAT = "json"; // 'html'
const TESTING_METHOD = "desktop"; // 'mobile'
const isMobile = TESTING_METHOD === "mobile";
const USER_AGENT = secretUserAgent()

if (USER_AGENT === "replace this return value with the provided secret user agent") {
  console.error("Please go to secretUserAgent.mjs and replace the return value with the secret user-agent key provided.")
  process.exit(1)
}

export default async function runLighthouse(url) {
  const viewport = isMobile ? { width: 500, height: 700 } : { width: 1400, height: 800 }
  const chrome = await chromeLauncher.launch({
    chromeFlags: [
      `--window-size=${viewport.width},${viewport.height}`,
      "--headless=new",
      '--disable-blink-features=AutomationControlled',
      '--disable-gpu',
      '--no-sandbox',
      // IMPORTANT: comment out all logic pertaining to user agent if your ip address
      // hasn't yet been configured to use the user agent; otherwise you won't have access.
      // `--user-agent=${USER_AGENT}`
    ],
    timeout: 120000,
});
  const options = {
    port: chrome.port,
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
        // emulatedUserAgent: USER_AGENT,
    }
  }

  try {
    const runnerResult = await lighthouse(url, options, config);
    const accessibilityScore = runnerResult.lhr.categories.accessibility.score * 100;
    console.log("Viewport used:", runnerResult.lhr.configSettings.screenEmulation);
    return [runnerResult.report, accessibilityScore]
  } catch (err) {
    console.error(`Lighthouse failed for ${url}:`, err)
    return null
  } finally {
    await chrome.kill()
  }
}
