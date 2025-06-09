import fs from 'fs'

const fileNames = fs.readFileSync('./audit-results/1-Main_Page.json', 'utf8')

console.log(typeof(fileNames))