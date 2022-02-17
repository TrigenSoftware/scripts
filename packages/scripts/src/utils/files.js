import { resolve, dirname } from 'path'
import { constants, promises } from 'fs'

const { access, readFile } = promises

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
 * Find and read package.json file.
 * @returns {Promise<object>} package.json
 */
export async function readPackageJsonUpward() {
  try {
    const path = await findFileUpward('package.json')
    const pkg = JSON.parse(await readFile(path, 'utf8'))

    return pkg
  } catch (err) {
    throw new Error(`Can't find package.json`)
  }
}
