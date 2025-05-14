import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
// import fs from "fs";

// const BASE_URL = "https://www.familysearch.org/en/wiki/";
// const PAGE = "Guild_of_One-Name_Studies";
// const PAGE = "United_States,_Social_Security_Death_Index_-_FamilySearch_Historical_Records"
const PAGE = "Denmark_Feast_Day_Calendars"
const OUTPUT_FORMAT = "json"; // 'html'
const TESTING_METHOD = "desktop"; // 'mobile'

const isMobile = TESTING_METHOD === "mobile";

export default async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
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
        // throttling: {
        //     rttMs: 40,
        //     throughputKbps: 10240,
        //     cpuSlowdownMultiplier: 1,
        //     requestLatencyMs: 0,
        //     downloadThroughputKbps: 0,
        //     uploadThroughputKbps: 0,
        // },
        // onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        onlyCategories: ['accessibility'],
        // userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    }
  }

  const runnerResult = await lighthouse(url, options, config);

  const accessibilityScore = runnerResult.lhr.categories.accessibility.score * 100;
  // for (const key in categories) {
  //   console.log(`${categories[key].title}: ${categories[key].score * 100}`);
  // }

  // fs.writeFileSync(
  //   `${TESTING_METHOD}-${PAGE}.${OUTPUT_FORMAT}`,
  //   runnerResult.report
  // );

  await chrome.kill();
  return [runnerResult.report, accessibilityScore]
}

// TODO: generate a total number of issues per page
// put accessibility score in json output
// issue count (total number of items to edit)
// starting score beforehand -> ending score
