export default function classifyIssue (selector='', path='') {
    const stringToClassify = `${selector} ${path}`.toLowerCase()

    if (/vector|mw-panel|mw-head|footer|skin|header|sidebar/.test(stringToClassify)) {
        return 'skin'
    }

    if (/template|infobox|navbox|wikitable|toc/.test(stringToClassify)) {
        return 'template'
    }

    if (/mw-parser-output|content|\.mw-content-ltr/.test(stringToClassify)) {
        return 'page'
    }

    return 'unknown'
}