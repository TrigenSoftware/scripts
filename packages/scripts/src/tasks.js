import cpy from 'cpy'
import del from 'del'
import { isObject, spawn, isArg, parseArgs } from './utils/index.js'

/**
 * @typedef {import('../types.d').IScriptTaskContext} IScriptTaskContext
 */

/**
 * Run shell command.
 * @param {...any} args - argv list. First argument can be an env object. Last argument can be a spawn options object.
 * @returns Task function.
 */
export function sh(...args) {
  return async (/** @type {IScriptTaskContext} */ ctx = {}, $spawn = spawn) => {
    const { stdio = true } = ctx
    const env = {
      ...process.env
    }
    const options = {
      env,
      stdio: stdio
        ? 'inherit'
        : 'pipe'
    }

    if (isObject(args[0])) {
      Object.assign(env, args.shift())
    }

    if (isObject(args[args.length - 1])) {
      Object.assign(options, args.pop())
    }

    const [cmd, ...argv] = args
    const output = await $spawn(cmd, argv.concat(ctx.argv).filter(isArg), options)

    return stdio ? '' : output
  }
}

/**
 * Copy files using `cpy` package.
 * @param {string[]} source
 * @param {string} destination
 * @param {Record<string, any>} options - `cpy` options
 * @returns Task function.
 */
export function cp(source, destination, options) {
  return async ({ argv = [] } = {}, $cpy = cpy) => {
    const [
      restSource,
      {
        d,
        dest,
        ...restOptions
      }
    ] = parseArgs(argv, ['d', 'dest'])
    const finalDest = dest || d || destination

    await $cpy(source.concat(restSource), finalDest, {
      ...options,
      ...restOptions
    })
  }
}

/**
 * Remove files using `del` package.
 * @param {string[]} patterns
 * @param {Record<string, any>} options - `del` options
 * @returns Task function.
 */
export function rm(patterns, options) {
  return async ({ argv = [] } = {}, $del = del) => {
    const [restPatterns, restOptions] = parseArgs(argv)

    await $del(patterns.concat(restPatterns), {
      ...options,
      ...restOptions
    })
  }
}
