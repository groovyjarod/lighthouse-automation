export default function extractRelevantItemData(itemArray) {
    /* creates a new object that only returns relevant key-value pairs
    of the json object. */

    const returnData = []
    for (let rawItemData of itemArray) {
        const item = rawItemData.node
        const newItemData = {
            snippet: item.snippet,
            selector: item.selector,
            explanation: item.explanation,
            boundingRect: item.boundingRect,
            subItems: rawItemData.subItems
        }
        returnData.push(newItemData)
    }
    return returnData
}
