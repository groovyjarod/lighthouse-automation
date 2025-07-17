import fs from 'fs'
import path from 'path'

const outputDir = 'audit-comparisons'
const oldDir = 'old-audit-results'
const newDir = 'audit-results'

const sharedFiles = fs.readdirSync(oldDir).filter(file => file.endsWith('.json') && fs.existsSync(path.join(newDir, file)))
for (const fileName of sharedFiles) {
    const oldPath = path.join(oldDir, fileName)
    const newPath = path.join(newDir, fileName)

    const oldData = JSON.parse(fs.readFileSync(oldPath, 'utf8'))
    const newData = JSON.parse(fs.readFileSync(newPath, 'utf8'))

    const oldKeys = Object.keys(oldData)
    const newKeys = Object.keys(newData)

    const addedKeys = newKeys.filter(newKey => !oldKeys.includes(newKey))
    const removedKeys = oldKeys.filter(oldKey => !newKeys.includes(oldKey))

    const results = {
        file: fileName,
        addedKeys,
        removedKeys
    }

    const outputPath = path.join(outputDir, fileName.replace('.json', '-diff.json'))
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2))
    console.log(`${fileName} compared.`)
}

console.log('All comparisons finished.')