const builtinPlugins = new Set([
  'typescript',
  'unicorn',
  'react',
  'react-perf',
  'nextjs',
  'oxc',
  'import',
  'jsdoc',
  'jsx-a11y',
  'node',
  'promise',
  'jest',
  'vitest',
  'vue'
])

function autoPlugins(rules) {
  const plugins = new Set()

  for (const rule of Object.keys(rules)) {
    const [plugin] = rule.split('/')

    if (builtinPlugins.has(plugin) && !plugins.has(plugin)) {
      plugins.add(plugin)
    }
  }

  return [...plugins]
}

export function defineConfig(config) {
  const finalConfig = {
    ...config
  }

  if (finalConfig.extends) {
    const ignorePatterns = []
    const env = {}

    finalConfig.extends.forEach((config) => {
      if (config.ignorePatterns) {
        ignorePatterns.push(...config.ignorePatterns)
      }

      Object.assign(env, config.env)
    })

    if (ignorePatterns.length > 0) {
      finalConfig.ignorePatterns = [
        ...finalConfig.ignorePatterns || [],
        ...ignorePatterns
      ]
    }

    finalConfig.env = {
      ...env,
      ...finalConfig.env
    }
  }

  if (finalConfig.rules) {
    finalConfig.overrides = [
      {
        files: ['**/*'],
        plugins: autoPlugins(finalConfig.rules),
        rules: finalConfig.rules
      },
      ...finalConfig.overrides || []
    ]

    delete finalConfig.rules
  }

  return finalConfig
}
