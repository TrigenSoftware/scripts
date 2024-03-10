import { spawn as spawnChild } from 'child_process'

/**
 * Spawn child process.
 * @param {string} cmd
 * @param {string[]} args
 * @param {boolean} stdio
 * @returns {Promise<{ exitCode: number, output?: string | Error }>} Output.
 */
export function spawn(cmd, args, stdio = true) {
  return new Promise((resolve) => {
    const env = {
      FORCE_COLOR: true,
      ...process.env
    }
    const options = {
      env,
      stdio: stdio ? 'inherit' : 'pipe'
    }
    const child = spawnChild(cmd, args, options)
    let output = ''
    const onData = (data) => {
      output += data.toString()
    }
    const onDone = (error) => {
      resolve({
        exitCode: child.exitCode,
        output: output || error
      })
    }

    child.stdout?.on('data', onData)
    child.stderr?.on('data', onData)
    child.on('close', onDone)
    child.on('error', onDone)
  })
}
