import runLighthouse from './generateLighthouseReport.mjs'
import getAudits from './getAudits.mjs'

// run lighthouse and return data as json object
async function getRawAuditData (urlPath) {
    const [rawResults, accessibilityScore] = await runLighthouse(urlPath)
    return [rawResults, accessibilityScore]
}

// retrieve json object and return object with relevant data
async function getAuditAccessibilityData (urlPath) {
    const [auditResults, accessibilityScore] = await getRawAuditData(urlPath)
    return [getAudits(auditResults), accessibilityScore]
}

// extract relevant data
async function organizeData(urlPath) {
    const [rawResultsData, accessibilityScore] = await getAuditAccessibilityData(urlPath)
    const initialJsonReport = {}
    initialJsonReport['accessibilityScore'] = accessibilityScore
    rawResultsData.forEach((item, index) => {
        const {id, title, description, items} = item
        initialJsonReport[`${id}-${index+1}`] = {title, description, items}
    })
    const finalizedJsonReport = JSON.stringify(initialJsonReport, null, 2)
    return finalizedJsonReport
}

// default function that invokes all others
export default async function createReport(urlPath) {
    console.log(`Commencing audit on ${urlPath}...`)
    const dataToWrite = await organizeData(urlPath)
    return dataToWrite
}