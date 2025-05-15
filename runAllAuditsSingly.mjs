import createReport from "./createFinalizedReport.mjs";
import fs from 'fs'

const exampleFullUrl = 'https://www.familysearch.org/en/wiki/Denmark_Feast_Day_Calendars'
const url = 'https://www.familysearch.org/'
const language = 'en'
const pathsRaw = fs.readFileSync('./wikiPaths.txt', 'utf8')
const paths = pathsRaw.split('\n')

async function getReportData(url) {
    const data = await createReport(url)
    return data
}

async function commenceAllAudits (paths) {
    for (let i = 0; i < paths.length; i++) {
        const fullUrl = `${url}${language}/wiki/${paths[i]}`
        console.log(`Starting on ${fullUrl}...`)
        const jsonData = await getReportData(fullUrl)
        console.log('Writing to file...')
        fs.writeFileSync(`./audit-results/${i}-${paths[i]}.json`, jsonData, 'utf8')
        console.log('File completed.')
    }

}

commenceAllAudits(paths)