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
        rules: finalConfig.rules
      },
      ...finalConfig.overrides || []
    ]

    delete finalConfig.rules
  }

  return finalConfig
}
