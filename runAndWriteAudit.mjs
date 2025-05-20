import fs from 'fs'
import createReport from './createFinalizedReport.mjs'

const [,, url, outputFile] = process.argv

if (!url || !outputFile) {
    console.error("usage: node runAndWriteAudit.mjs <url> <outputFile>")
    process.exit(1)
}

async function getReportData(url) {
    const returnData = await createReport(url)
    return returnData
}

try {
    const jsonData = await getReportData(url)
    fs.writeFileSync(outputFile, jsonData, 'utf8')
    console.log('Audit complete.')
} catch (err) {
    console.error(`Audit failed for ${url}:`, err.message)
    process.exit(1)
}