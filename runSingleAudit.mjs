import { spawn } from "child_process";

const url = "https://www.familysearch.org/en/wiki/Finding_Your_United_States_Indigenous_Ancestor"

export default function runSingleAudit (path) {
    return new Promise((resolve, reject) => {
        const child = spawn("node", ["runAndWriteAudit.mjs", path, "./test-audit-results/newTest.json"], {stdio: "inherit"})
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