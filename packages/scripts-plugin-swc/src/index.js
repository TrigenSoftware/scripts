import { stringifyArgs, toArray, sh } from '@trigen/scripts'
import { findSwcrc } from './utils.js'

export * from './utils.js'

/**
 * @typedef {import('@trigen/scripts/types.d').IScriptTaskContext} IScriptTaskContext
 */

/**
 * Transpile code with SWC.
 * @param {object} [options]
 * @param {string | string[]} [options.input] - list or patterns of input files.
 * @param {string} [options.configFile] - path to config file.
 * @param {string | string[]} [options.ignore] - list or patterns of files to ignore.
 * @param {string | string[]} [options.only] - list or patterns of files to traspile.
 * @param {boolean | 'inline'} [options.sourceMaps] -  emit source maps or not.
 * @param {string} [options.outFile] - path to output file.
 * @param {string} [options.outDir] - path to output directory.
 * @returns Task function.
 */
export function swc({
  input,
  configFile,
  ignore,
  only,
  sourceMaps = 'inline',
  outFile,
  outDir
} = {}) {
  const swc = sh('swc')

  return async (/** @type {IScriptTaskContext} */ ctx = {}) => {
    const finalConfigFile = configFile || await findSwcrc()
    const argv = stringifyArgs(toArray(input), {
      configFile: finalConfigFile,
      ignore,
      only,
      sourceMaps,
      outFile,
      outDir
    }).concat(ctx.argv)

    return swc({
      ...ctx,
      argv
    })
  }
}
