import { toArray, sh, stringifyArgs } from '@trigen/scripts'

/**
 * Lint files with ESLint.
 * @param {object} [options]
 * @param {string | string[]} [options.files] - files or patterns to be linted.
 * @param {boolean} [options.fix] - fix files.
 * @returns Task function.
 */
export function eslint({ files = 'src/**/*.{js,jsx,ts,tsx}', fix = false } = {}) {
  const args = stringifyArgs(toArray(files), {
    cache: true,
    cacheFile: 'node_modules/.cache/eslintcache',
    fix
  })

  return sh('eslint', ...args)
}
