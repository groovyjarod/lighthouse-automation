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
    let itemCount = 0
    initialJsonReport['accessibility-score'] = accessibilityScore
    rawResultsData.forEach((item, index) => {
        const {id, title, description, boundingRect, items} = item
        const newItems = []
        for (let itemData of items) {
            const newItem = {
                snippet: itemData.snippet,
                selector: itemData.selector,
                explanation: itemData.explanation
            }
            if (itemData.subItems && itemData.subItems.items) {
                const newSubItems = itemData.subItems.items.map(subItem => ({
                    snippet: subItem.relatedNode?.snippet,
                    selector: subItem.relatedNode?.selector,
                    boundingRect: subItem.relatedNode?.boundingRect,
                    nodeLabel: subItem.relatedNode?.nodeLabel
                }))
                newItem.subItems = newSubItems
            }
            newItems.push(newItem)
        }
        itemCount++
        initialJsonReport[`${id}-${index+1}`] = {title, description, boundingRect, newItems}
    })
    initialJsonReport['number-of-Items'] = itemCount
    console.log(itemCount)
    const finalizedJsonReport = JSON.stringify(initialJsonReport, null, 2)
    return finalizedJsonReport
}

// default function that invokes all others
export default async function createReport(urlPath) {
    console.log(`Commencing audit on ${urlPath}...`)
    const dataToWrite = await organizeData(urlPath)
    return dataToWrite
}