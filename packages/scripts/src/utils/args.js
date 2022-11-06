import { read, argv } from 'argue-cli'

const pnpm7 = 7

/**
 * Detect package manager from environment.
 * @returns Package manager name. 'npm` by default.
 */
export function detectPackageManager() {
  const parsedUa = /(^\w+)(?:\/(\d+)|)/.exec(process.env.npm_config_user_agent)

  if (parsedUa) {
    const [
      ,
      pm,
      ver
    ] = parsedUa

    if (pm) {
      if (pm === 'pnpm' && ver && Number(ver) >= pnpm7) {
        return 'pnpm >=7'
      }

      return pm
    }
  }

  return (
    /node_modules[/\\](\w+)[/\\]/.exec(process.env.npm_execpath)?.[1]
    || 'npm'
  )
}

/**
 * Get args to run script with package manager.
 * @param {string} pm - Package manager name.
 * @param {string[]} args - Command args.
 * @returns Args to run script with package manager.
 */
export function getRunArgs(pm, args) {
  if (pm === 'yarn' || pm === 'pnpm >=7' || args.length < 2) {
    return ['run', ...args]
  }

  const [script, ...restArgs] = args

  return [
    'run',
    script,
    '--',
    ...restArgs
  ]
}

/**
 * Get args to run command.
 * @param {string} pm - Package manager name.
 * @param {string[]} args - Command args.
 * @param {{ scripts?: Record<string, string> }} pkg - package.json
 * @returns {[string, string[]]} - Bin and commands.
 */
export function getArgs(pm, args, pkg) {
  if (pkg.scripts && (args[0] in pkg.scripts)) {
    return [pm.split(' ')[0], getRunArgs(pm, args)]
  }

  const [bin, ...restArgs] = args

  return [bin, restArgs]
}

/**
 * Read scripts from argv to run with package manager.
 * @returns Package manager scripts to run.
 */
export function readScripts() {
  const scripts = []
  let tmpScript = []
  let tmpArg
  let inBrackets = false

  while (argv.length) {
    tmpArg = read()

    if (!inBrackets && tmpArg === '[') {
      inBrackets = true
      tmpScript = []
      continue
    }

    if (inBrackets && tmpArg === ']') {
      inBrackets = false
      scripts.push(tmpScript)
      tmpScript = []
      continue
    }

    if (inBrackets) {
      tmpScript.push(tmpArg)
    } else {
      scripts.push([tmpArg])
    }
  }

  return scripts
}
