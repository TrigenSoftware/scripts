import { readFileSync } from 'fs'
import { readFile } from 'fs/promises'
import { findFileUpward, findFileUpwardSync } from '@trigen/scripts'

/**
 * Find path to .swcrc config.
 * @param {string} [dir] - directory to start search.
 * @returns {Promise<string>} Path to config.
 */
export function findSwcrc(dir = process.cwd()) {
  return findFileUpward('.swcrc', dir)
}

/**
 * Synchronously find path to .swcrc.
 * @param {string} [dir] - directory to start search.
 * @returns {string} Path to config.
 */
export function findSwcrcSync(dir = process.cwd()) {
  return findFileUpwardSync('.swcrc', dir)
}

/**
 * Find and read .swcrc config.
 * @param {string} [dir] - directory to start search.
 * @returns {Promise<Record<string, any>>} Config.
 */
export async function readSwcrc(dir = process.cwd()) {
  const path = await findSwcrc(dir)

  return JSON.parse(await readFile(path, 'utf8'))
}

/**
 * Synchronously find and read .swcrc config.
 * @param {string} [dir] - directory to start search.
 * @returns {Record<string, any>} Config.
 */
export function readSwcrcSync(dir = process.cwd()) {
  const path = findSwcrcSync(dir)

  return JSON.parse(readFileSync(path, 'utf8'))
}
