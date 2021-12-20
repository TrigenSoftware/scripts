import { join } from 'path'
import { writeFile } from 'fs/promises'
import { stringifyArgs, sh } from '@trigen/scripts'

/**
 * Check TypeScript files.
 * @returns Task function.
 */
export function check() {
  return sh('tsc', '--skipLibCheck', '--noEmit')
}

/**
 * Emit declaration for TypeScript files.
 * @returns Task function.
 */
export function emitDeclarations() {
  return sh('tsc', '--skipLibCheck', '--emitDeclarationOnly')
}

/**
 * Run `ts-node-dev`.
 * @param {object} options - `ts-node-dev` options.
 * @returns Task function.
 */
export function node(options) {
  const args = stringifyArgs(['-r', 'tsconfig-paths/register'], options)

  return sh('ts-node-dev', ...args)
}

/**
 * Generate documentation for TypeScript files.
 * @param {object} options
 * @param {string} options.input - path to directory with sources.
 * @param {boolean} [options.nojekyll] - create .nojekyll file.
 * @returns Task function.
 */
export function typedoc({
  input,
  nojekyll = true,
  ...options
}) {
  const args = stringifyArgs([input], {
    excludeExternals: true,
    ...options
  })
  const spawn = sh('typedoc', ...args)

  return async (params) => {
    const result = await spawn(params)

    if (nojekyll) {
      const nojekyllPath = join(options.out || './docs', '.nojekyll')

      await writeFile(nojekyllPath, '')
    }

    return result
  }
}
