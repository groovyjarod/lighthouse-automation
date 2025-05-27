import fs from "fs";
import { spawn } from "child_process";
import pLimit from "p-limit";
import estimateConcurrency from "./estimateConcurrency.mjs";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "node:process";
const rl = readline.createInterface({ input, output });

const urlBase = "https://www.familysearch.org/";
const language = "en";
const pathsRaw = fs.readFileSync("./wikiPaths.txt", "utf8");
const paths = pathsRaw.split("\n").filter(Boolean);

const numberOfConcurrentAudits = estimateConcurrency();

const answer = await rl.question(
  `\nThe number of recommended audits for this is ${numberOfConcurrentAudits}.\nHow many concurrent tests would you like to commence?\n`
);
rl.close();

const limit = pLimit(parseInt(answer));

async function retryAudit(fn, retries = 2) {
  let errMessage;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      errMessage = err;
      console.warn(`Retry ${i + 1} failed. Trying agin...`);
    }
  }
  throw errMessage;
}

function runAuditAsChild(fullUrl, outputPath) {
  return new Promise((resolve, reject) => {
    const child = spawn("node", ["runAndWriteAudit.mjs", fullUrl, outputPath], {
      stdio: "inherit",
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(`Child process for ${fullUrl} exited with code ${code}`)
        );
      }
    });

    child.on("error", (err) => {
      console.error(`Spawn error for ${fullUrl}: ${err}`);
      reject(err);
    });
  });
}

async function commenceAllAudits(paths) {
  const tasks = paths.map((path, index) => {
    const fullUrl = `${urlBase}${language}/wiki/${path}`;
    const outputFile = `./audit-results/${index + 1}-${path}.json`;
    return limit(() =>
      retryAudit(() => runAuditAsChild(fullUrl, outputFile), 2)
    );
  });

  await Promise.all(tasks);
  console.log("All audits complete!");
}

commenceAllAudits(paths);

// TODO: Get it to update to be compliant, acceptable, and non-compliant