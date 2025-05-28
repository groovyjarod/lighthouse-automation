// IMPORTANT!!!!!!!! PLEASE READ BEFORE EXECUTING SCRIPT!!!!
/*
This script requires the insertion of a secret user-agent, which will be provided to anyone authorized to run
automated lighthouse audits for FamilySearch. Please refer to the code - create a .mjs file, if one doesn't
already exist, named secretUserAgent.mjs, and paste the following code, plugging in the secret user-agent
as the return variable:

export default function secretUserAgent () {
  return ______;
}

*/

import secretUserAgent from "./secretUserAgent.mjs";

import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
// import fs from "fs";

const OUTPUT_FORMAT = "json"; // 'html'
const TESTING_METHOD = "desktop"; // 'mobile'
const isMobile = TESTING_METHOD === "mobile";
const USER_AGENT = secretUserAgent()

// console.log(USER_AGENT)
// if (USER_AGENT === "replace this return value with the provided secret user agent") {
//   console.error("Please go to secretUserAgent.mjs and replace the return value with the secret user-agent key provided.")
//   process.exit(1)
// }

export default async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({ chromeFlags: [
    "--headless=new",
    '--disable-blink-features=AutomationControlled',
    '--disable-gpu',
    '--no-sandbox',
    // `--user-agent=${USER_AGENT}`
  ]
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
            width: isMobile ? 500 : 1920,
            height: 1080,
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
    return [runnerResult.report, accessibilityScore]
  } catch (err) {
    console.error(`Lighthouse failed for ${url}:`, err)
    return null
  } finally {
    await chrome.kill()
  }

  // the following is deprecated until this script uses more than just accessibility for auditing.
  // for (const key in categories) {
  //   console.log(`${categories[key].title}: ${categories[key].score * 100}`);
  // }

  // fs.writeFileSync(
  //   `${TESTING_METHOD}-${PAGE}.${OUTPUT_FORMAT}`,
  //   runnerResult.report
  // );

}
// starting score beforehand -> ending score
