import { spawn as spawnChild } from 'child_process'
import { OutputError } from '../errors/index.js'

/**
 * Spawn child process.
 * @param {string} cmd
 * @param {string[]} args
 * @param {object} options
 * @returns {Promise<string>} Output.
 */
export function spawn(cmd, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawnChild(cmd, args, options)
    let output = ''
    const onData = (data) => {
      output += data.toString()
    }
    const onDone = (error) => {
      if (error) {
        reject(
          error instanceof Error
            ? error
            : new OutputError(output)
        )
      } else {
        resolve(output)
      }
    }

    child.stdout?.on('data', onData)
    child.stderr?.on('data', onData)
    child.on('close', onDone)
    child.on('exit', onDone)
    child.on('error', onDone)
  })
}
