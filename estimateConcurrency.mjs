import os from 'os'

export default function estimateConcurrency() {
    const cores = os.cpus().length
    const totalMemGB = os.totalmem() / 1024 ** 3
    const safeMemoryUsage = totalMemGB * 0.8

    const maxMemory = Math.floor(safeMemoryUsage / 0.5)
    const maxCpu = Math.floor(cores * 0.8)

    const concurrency = Math.max(1, Math.min(maxCpu, maxMemory))

    // console.log(`Resources: ${cores} cores, and ~${totalMemGB.toFixed(3)}Gigs free.`)
    // console.log(`Running up to ${concurrency} audits concurrently...`)
    return concurrency
}

estimateConcurrency()