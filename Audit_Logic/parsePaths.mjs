export default function parseLighthousePath(pathString) {
  const parts = pathString.split(",")
  const structure = []
  const selectorParts = []

  for (let i = 0; i < parts.length; i += 2) {
    const index = parseInt(parts[i], 10)
    const tag = parts[i + 1].toLowerCase()

    structure.push(`${tag}[${index}]`)

    if (index === 0) {
      selectorParts.push(tag)
    } else {
      selectorParts.push(`${tag}:nth-child(${index + 1})`)
    }
  }

  return {
    structure: structure.join(" > "),
    approximateSelector: selectorParts.join(" > "),
  }
}
