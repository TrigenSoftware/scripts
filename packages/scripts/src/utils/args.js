import { camelCase } from 'camel-case'
import { paramCase } from 'param-case'

export {
  camelCase,
  paramCase
}

/**
 * Checks if given value can be used as spawn argument.
 * @param {any} arg
 * @returns {boolean} Result of checking.
 */
export function isArg(arg) {
  return typeof arg === 'string' || typeof arg === 'number'
}

/**
 * Checks if given value can be stringified.
 * @param {any} arg
 * @returns {boolean} Result of checking.
 */
export function isStringableArg(arg) {
  return isArg(arg) || arg === true || Array.isArray(arg)
}

const kvargRegExp = /^-{1,2}([^\s]+)$/

/**
 * Parse arguments.
 * @param {string[]} argv
 * @param {string[]} [argsWithValues] - List of arguments with values, in camelCase.
 * @param {{ arg?: (value: string) => boolean; kvarg?: (key: string, value: string | boolean) => boolean }} [filters]
 * @returns {[string[], Record<string, string | boolean>]} Positional and key-value arguments.
 */
export function parseArgs(argv, argsWithValues = [], filters) {
  const argFilter = filters?.arg || (() => true)
  const kvargFilter = filters?.kvarg || (() => true)
  const kvargs = {}
  const args = []
  const argc = argv.length
  let arg
  let kvarg
  let key
  let value

  for (let i = 0; i < argc; i++) {
    arg = argv[i]
    kvarg = kvargRegExp.exec(arg)

    if (kvarg) {
      key = camelCase(kvarg[1])
      value = argsWithValues.includes(key) ? argv[++i] : true

      if (kvargFilter(key, value)) {
        kvargs[key] = value
      }
    } else if (argFilter(arg)) {
      args.push(arg)
    }
  }

  return [args, kvargs]
}

/**
 * Make arguments strings from list and key-value params.
 * @param {string[]} args - Positional arguments,
 * @param {Record<string, string | boolean>} kvargs - Key-value args.
 * @param {(key: string) => string} keyCase - Function to change key case.
 * @returns {string[]} Arguments strings.
 */
export function stringifyArgs(args, kvargs, keyCase = paramCase) {
  const argv = args.flat().filter(isStringableArg)
  let arg

  Object.entries(kvargs).forEach(([key, value]) => {
    if (!isStringableArg(value)) {
      return
    }

    arg = `--${keyCase(key)}`

    if (Array.isArray(value)) {
      value.forEach((value) => {
        argv.push(arg, value)
      })
    } else
    if (value === true) {
      argv.push(arg)
    } else {
      argv.push(arg, value)
    }
  })

  return argv
}
