import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
// import fs from "fs";

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
        // onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        onlyCategories: ['accessibility'],
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
