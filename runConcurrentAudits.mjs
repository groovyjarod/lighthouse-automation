import fs from 'fs';
import { spawn } from 'child_process';
import pLimit from 'p-limit';

const urlBase = 'https://www.familysearch.org/';
const language = 'en';
const pathsRaw = fs.readFileSync('./wikiPaths.txt', 'utf8');
const paths = pathsRaw.split('\n').filter(Boolean);

const auditSpeedRate = process.argv[2]

if (!auditSpeedRate) {
  console.error("Usage: node runConcurrentAudits.mjs <auditSpeedRate>")
  process.exit(1)
}

// Concurrency limit
const limit = pLimit(parseInt(auditSpeedRate)); // or 2 if needed

function runAuditAsChild(fullUrl, outputPath) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', ['runSingleAudit.mjs', fullUrl, outputPath], {
      stdio: 'inherit' // Inherit stdio so you see output in terminal
    });

    child.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Child process for ${fullUrl} exited with code ${code}`));
      }
    });
  });
}

async function commenceAllAudits(paths) {
  const tasks = paths.map((path, index) => {
    const fullUrl = `${urlBase}${language}/wiki/${path}`;
    const outputFile = `./audit-results/${index}-${path}.json`;
    return limit(() => runAuditAsChild(fullUrl, outputFile));
  });

  await Promise.all(tasks);
  console.log('All audits complete!');
}

commenceAllAudits(paths);
