import stylelint from 'stylelint'

const {
  createPlugin,
  utils: {
    report,
    ruleMessages,
    validateOptions
  }
} = stylelint
const ruleName = 'trigen/uikit-module-root'
const messages = ruleMessages(ruleName, {
  rejected: 'A kit component\'s module styles its root element as `.root`.'
})
// `uikit/Button/Button.module.css`: a component's own module in the kit
const UIKIT_MODULE_PATTERN = /[\\/]uikit[\\/]([^\\/]+)[\\/]\1\.module\.css$/
const ROOT_CLASS_PATTERN = /\.root(?![\w-])/

function ruleFunction(primary) {
  return (root, result) => {
    if (!validateOptions(result, ruleName, {
      actual: primary
    })) {
      return
    }

    const file = root.source?.input.file

    if (!file || !UIKIT_MODULE_PATTERN.test(file)) {
      return
    }

    let hasRoot = false

    root.walkRules((rule) => {
      if (ROOT_CLASS_PATTERN.test(rule.selector)) {
        hasRoot = true
      }
    })

    if (!hasRoot) {
      report({
        ruleName,
        result,
        node: root,
        message: messages.rejected
      })
    }
  }
}

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages

export default createPlugin(ruleName, ruleFunction)
