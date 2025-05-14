import fs from "fs";
import path from "path";
import extractRelevantItemData from "./extractItemData.mjs";

export default function getAudits(jsonData) {
  const data = JSON.parse(jsonData)
  const groupLabels = data.categoryGroups || {}
  const auditLocations = data.categories.accessibility.auditRefs
  const flaggedAudits = []
  const returnData = []

  // take id and group fron each auditRef to find full data
  auditLocations.forEach(({ id, group }) => {
    const audit = data.audits[id];
    if (!audit || audit.score !== 0) return
    if (!audit.details.items) return
    const auditData = {
        id: audit.id,
        title: audit.title,
        description: audit.description,
        items: [...extractRelevantItemData(audit.details.items || [])]
    }
    // const groupName = groupLabels[group]?.title || "Ungrouped"
    // if (!flaggedAudits[groupName]) flaggedAudits[groupName] == []
    returnData.push(auditData)
  });

  return returnData
}
