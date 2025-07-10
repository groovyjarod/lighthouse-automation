import { spawn } from "child_process";
import readline from "readline/promises"
import { stdin as input, stdout as output } from "node:process";
const rl = readline.createInterface({ input, output });

const url = await rl.question(`\nEnter URL here:\n`)
rl.close()

// const url = "https://www.familysearch.org/en/wiki/New_York_Vital_Records/"
const baseUrl = "https://www.familysearch.org/en/wiki/"
const relativePath = "United_States_Church_Records"
// const url = `${baseUrl}${relativePath}`

export default function runSingleAudit (path) {
    return new Promise((resolve, reject) => {
        const child = spawn("node", ["runAndWriteAudit.mjs", path, `./custom-audit-results/custom-${relativePath}.json`], {stdio: "inherit"})
        child.on("close", (code) => {
            if (code === 0) {
                resolve()
            } else {
                reject(
                    new Error(`Child process failed for runSingleAudit.mjs. Exited with code ${code}`)
                )
            }
        })
        child.on("error", (err) => {
            console.error(`Spawn error for runSingleAudit.mjs: ${err}`)
            reject(err)
        })
    })
}

runSingleAudit(url)