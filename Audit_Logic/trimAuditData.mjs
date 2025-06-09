import fs from "fs";
import path from "path";
import extractRelevantItemData from "./extractItemData.mjs";

export default function trimAuditData(jsonData) {
  const data = JSON.parse(jsonData)
  const auditLocations = data.categories.accessibility.auditRefs
  const returnData = []

  // take id and group fron each auditRef to find full data
  auditLocations.forEach(({ id }) => {
    const audit = data.audits[id];
    if (!audit || audit.score !== 0) return
    if (!audit.details.items) return
    const auditData = {
        id: audit.id,
        title: audit.title,
        description: audit.description,
        items: [...extractRelevantItemData(audit.details.items || [])]
    }
    returnData.push(auditData)
  });

  return returnData
}
