import { cpus } from 'os'
import pLimit from 'p-limit'
import { spawn } from './spawn.js'
import { getArgs } from './args.js'

/**
 * Run package manager scripts serial.
 * @param {string} pm
 * @param {string[][]} scripts
 * @param {{ scripts?: Record<string, string> }} pkg - package.json
 * @returns Exit code
 */
export async function runSerial(pm, scripts, pkg) {
  const cmds = scripts.map(script => getArgs(pm, script, pkg))
  let exitCode = 0
  let result

  for (const [bin, args] of cmds) {
    result = await spawn(bin, args)
    exitCode = exitCode || result.exitCode

    if (result.output) {
      process.stdout.write(result.output)
    }
  }

  return exitCode
}

/**
 * Run package manager scripts parallel.
 * @param {string} pm
 * @param {string[][]} scripts
 * @param {{ scripts?: Record<string, string> }} pkg - package.json
 * @returns Exit code.
 */
export async function runParallel(pm, scripts, pkg) {
  const limit = pLimit(cpus().length)
  const cmds = scripts.map(script => getArgs(pm, script, pkg))
  const tasks = cmds.map(([bin, args]) => limit(() => spawn(bin, args, false)))
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
