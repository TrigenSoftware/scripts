import { stringifyArgs, toArray, sh } from '@trigen/scripts'

/**
 * Transpile code with Babel CLI.
 * @param {object} [options]
 * @param {string | string[]} [options.input] - files or patterns to transpile.
 * @param {string | string[]} [options.ignore] - files or patterns to ignore.
 * @param {boolean | 'inline'} [options.sourceMaps] - emit source maps or not.
 * @param {string} [options.outFile] - path to output file.
 * @param {string} [options.outDir] - path to output directory.
 * @returns Task function.
 */
export function babel({
  input,
  ignore,
  sourceMaps = 'inline',
  outFile,
  outDir
} = {}) {
  const options = stringifyArgs(toArray(input), {
    ignore,
    sourceMaps,
    outFile,
    outDir
  })

  return sh('babel', ...options)
}
