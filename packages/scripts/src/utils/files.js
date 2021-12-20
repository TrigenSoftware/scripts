import { resolve, dirname, join } from 'path'
import { constants, accessSync } from 'fs'
import { access } from 'fs/promises'
import fg from 'fast-glob'

const { sync: lsSync, isDynamicPattern } = fg

export {
  fg as ls,
  lsSync,
  isDynamicPattern
}

/**
 * Get directory with index from file name.
 * @param {string} filename
 * @returns {string} Directory with index.
 */
export function importDirFromFile(filename) {
  const [
    , name,
    ext
  ] = filename.split(/^([^.]+)/)

  return join(name, `index${ext}`)
}

/**
 * Find file starts from cwd ups to root.
 * @param {string} filename
 * @param {string} [dir]
 * @returns {Promise<string>} Path to file.
 */
export async function findFileUpward(filename, dir = process.cwd()) {
  const file = resolve(dir, filename)

  try {
    await access(file, constants.R_OK)

    return file
  } catch (err) {
    if (dir === '.') {
      throw err
    }

    return findFileUpward(filename, dirname(dir))
  }
}

/**
 * Find file starts from cwd ups to root.
 * @param {string} filename
 * @param {string} [dir]
 * @returns {string} Path to file.
 */
export function findFileUpwardSync(filename, dir = process.cwd()) {
  const file = resolve(dir, filename)

  try {
    accessSync(file, constants.R_OK)

    return file
  } catch (err) {
    if (dir === '.') {
      throw err
    }

    return findFileUpwardSync(filename, dirname(dir))
  }
}

/**
 * Find import starts from cwd ups to root.
 * @param {string} filename
 * @param {string} [dir]
 * @param {boolean} [index]
 * @returns {Promise<string>} Path to file.
 */
export async function findImportUpward(filename, dir = process.cwd(), index = false) {
  const file = resolve(dir, index ? importDirFromFile(filename) : filename)

  try {
    await access(file, constants.R_OK)

    return file
  } catch (err) {
    if (dir === '.') {
      throw err
    }

    if (!index) {
      return findImportUpward(filename, dir, true)
    }

    return findImportUpward(filename, dirname(dir))
  }
}
