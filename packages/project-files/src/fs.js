import { dirname } from 'path'
import { promises } from 'fs'

const { readFile, writeFile: wf, mkdir } = promises

export { readFile }

/**
 * Write file.
 * @param {string} path
 * @param {string} contents
 * @returns {Promise<void>}
 */
export async function writeFile(path, contents) {
  const dir = dirname(path)

  try {
    await mkdir(dir, {
      recursive: true
    })
  } catch (err) {
    /* Ignore error */
  }

  return wf(path, contents)
}
