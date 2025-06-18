import fs from 'fs'

const FOLDER_PATH = './audit-results'

export default function produceJsonReport () {
    const smallAudits = []
    const mediumAudits = []
    const largeAudits = []
    let itemCount = 0
    let subItemCount = 0
    let accessibilityScore
    const dirInfo = fs.readdirSync(FOLDER_PATH)
    for (let i = 1; i < dirInfo.length; i++) {
        const rawAudit = fs.readFileSync(`${FOLDER_PATH}/${dirInfo[i]}`, 'utf-8')
        const audit = JSON.parse(rawAudit)
        for (const [key, value] of Object.entries(audit)) {
            if (typeof(value) === 'object') {
                for (let itemData of value['items']) {
                    itemCount++
                    for (const [itemKey, itemValue] of Object.entries(itemData)) {
                        if (itemKey === 'subItems') {
                            subItemCount++
                            // console.log(itemData[itemKey])
                        }
                    }
                }
                // console.log(value['items'])
                // console.log()
            } else if (key === 'accessibility-score') {
                accessibilityScore = value
            }
        }
        const auditLength = rawAudit.split('\n').length
        if (auditLength > 64) {
            console.log(`Audit for ${dirInfo[i]}:`)
            console.log(`Item count: ${itemCount}`)
            console.log(`subItem count: ${subItemCount}`)
            console.log(`Number of lines: ${auditLength}`)
            console.log(accessibilityScore)
            console.log()
        }
        itemCount = 0
        subItemCount = 0
        // console.log(audit['number-of-Items'])
        // if (auditLength < 100) {
        //     smallAudits.push({})
        // }
        // console.log(`${dirInfo[i]} lines: ${auditLength}`)
    }
    // console.log(dirInfo.length)
}

produceJsonReport()