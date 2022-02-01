import { cpus } from 'os'
import pLimit from 'p-limit'
import { spawn } from './spawn.js'
import { getRunArgs } from './args.js'

/**
 * Run package manager scripts serial.
 * @param {string} pm
 * @param {string[][]} scripts
 * @returns Exit code
 */
export async function runSerial(pm, scripts) {
  const pmScripts = scripts.map(script => getRunArgs(pm, script))
  let exitCode = 0

  for (const pmScript of pmScripts) {
    exitCode = exitCode || (await spawn(pm, pmScript)).exitCode
  }

  return exitCode
}

/**
 * Run package manager scripts parallel.
 * @param {string} pm
 * @param {string[][]} scripts
 * @returns Exit code.
 */
export async function runParallel(pm, scripts) {
  const limit = pLimit(cpus().length)
  const pmScripts = scripts.map(script => getRunArgs(pm, script))
  const tasks = pmScripts.map(pmScript => limit(() => spawn(pm, pmScript, false)))
  let exitCode = 0
  /** @type {{ exitCode: number, output?: string | Error }} */
  let result

  for (const task of tasks) {
    result = await task
    exitCode = exitCode || result.exitCode
    process.stdout.write(result.output)
  }

  return exitCode
}
