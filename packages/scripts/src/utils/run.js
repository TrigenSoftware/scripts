import { cpus } from 'os'
import pLimit from 'p-limit'
import { spawn } from './spawn.js'
import { getArgs } from './args.js'

/**
 * Run package manager scripts parallel.
 * @param {string} pm
 * @param {string[][]} scripts
 * @param {{ scripts?: Record<string, string> }} pkg - package.json
 * @param {number} concurrency - Number of concurrent processes.
 * @returns Exit code.
 */
export async function run(pm, scripts, pkg, concurrency) {
  const limit = pLimit(concurrency)
  /** @type {Promise<ReturnType<typeof spawn>>[]} */
  const tasks = scripts.map(script => new Promise(
    resolve => limit(() => {
      const [bin, args] = getArgs(pm, script, pkg)
      const child = spawn(bin, args)

      resolve(child)

      return child.exitCode
    })
  ))
  let finalExitCode = 0

  for await (const task of tasks) {
    for await (const data of task.output) {
      if (data.source === 'stdout') {
        process.stdout.write(data.chunk)
      } else
        if (data.source === 'stderr') {
          process.stderr.write(data.chunk)
        }
    }

    finalExitCode = finalExitCode || await task.exitCode
  }

  return finalExitCode
}

/**
 * Run package manager scripts serial.
 * @param {string} pm
 * @param {string[][]} scripts
 * @param {{ scripts?: Record<string, string> }} pkg - package.json
 * @returns Exit code
 */
export function runSerial(pm, scripts, pkg) {
  return run(pm, scripts, pkg, 1)
}

/**
 * Run package manager scripts parallel.
 * @param {string} pm
 * @param {string[][]} scripts
 * @param {{ scripts?: Record<string, string> }} pkg - package.json
 * @returns Exit code.
 */
export function runParallel(pm, scripts, pkg) {
  return run(pm, scripts, pkg, cpus().length)
}
