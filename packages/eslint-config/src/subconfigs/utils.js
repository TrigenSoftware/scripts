import basicConfig from './basic.js'
import es6Config from './es6.js'

export function getRules(configs) {
  return configs.reduce((rules, config) => {
    if (config.rules) {
      return {
        ...rules,
        ...config.rules
      }
    }

    return rules
  }, {})
}

const rules = getRules([...basicConfig, ...es6Config])

export function getExtensionRules(prefix, extensionNames) {
  return extensionNames.reduce(
    (extensionRules, name) => ({
      ...extensionRules,
      [name]: 'off',
      [`${prefix}/${name}`]: rules[name]
    }),
    {}
  )
}
