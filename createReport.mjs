import fs from 'fs'
import path from 'path'
import runLighthouse from './generateLighthouseReport.mjs'
import getAudits from './getAudits.mjs'

// const pathsRaw = fs.readFileSync('./wikiPaths.txt', 'utf8')
// const allPaths = pathsRaw.split('\n')
// const paths = allPaths.slice(0, 4)
// console.log(paths)
// const urlPath = process.argv[2]
// if (!urlPath) {
//     console.error("Usage: node executeScript.mjs <url>")
//     process.exit(1)
// }


// run lighthouse and return data as json object
async function getRawAuditData (urlPath) {
    const rawResults = await runLighthouse(urlPath)
    return rawResults
}

// retrieve json object and return object with relevant data
async function getAuditAccessibilityData (urlPath) {
    const auditResults = await getRawAuditData(urlPath)
    return getAudits(auditResults)
}

// extract relevant data
async function organizeData(urlPath) {
    const rawResultsData = await getAuditAccessibilityData(urlPath)
    const initialJsonReport = {}

    rawResultsData.forEach((item, index) => {
        const {id, title, description, items} = item
        initialJsonReport[`${id}-${index+1}`] = {title, description, items}
    })
    const finalizedJsonReport = JSON.stringify(initialJsonReport, null, 2)
    return finalizedJsonReport
    // fs.writeFileSync('test-result.json', finalizedJsonReport, 'utf8')
}
export default async function createReport(urlPath) {
    console.log(`Commencing audit on ${urlPath}...`)
    const dataToWrite = await organizeData(urlPath)
    return dataToWrite
}