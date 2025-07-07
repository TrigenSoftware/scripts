import { spawn as spawnChild } from 'child_process'
import { exitCode } from '@simple-libs/child-process-utils'
import { mergeReadables } from '@simple-libs/stream-utils'

/**
 * Spawn child process.
 * @param {string} cmd
 * @param {string[]} args
 * @returns Output.
 */
export function spawn(cmd, args) {
  const child = spawnChild(cmd, args, {
    env: {
      FORCE_COLOR: true,
      ...process.env
    }
  })

  return {
    output: mergeReadables({
      stdout: child.stdout,
      stderr: child.stderr
    }),
    exitCode: exitCode(child)
  }
}
