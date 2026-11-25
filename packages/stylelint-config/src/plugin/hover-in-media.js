import stylelint from 'stylelint'
import {
  isInMedia,
  isString,
  toList
} from './media.js'

const {
  createPlugin,
  utils: {
    report,
    ruleMessages,
    validateOptions
  }
} = stylelint
const ruleName = 'trigen/hover-in-media'
const messages = ruleMessages(ruleName, {
  rejected: 'Put `:hover` styles in a hover media query, so a tap does not leave a control looking hovered.'
})
const HOVER_PATTERN = /:hover(?![\w-])/i
const HOVER_FEATURE_PATTERN = /\(\s*(any-)?hover\s*:\s*hover\s*\)/i

function ruleFunction(primary, secondaryOptions) {
  return (root, result) => {
    const valid = validateOptions(
      result,
      ruleName,
      {
        actual: primary
      },
      {
        actual: secondaryOptions,
        possible: {
          customMedia: [isString]
        },
        optional: true
      }
    )

    if (!valid) {
      return
    }

    const customMedia = toList(secondaryOptions?.customMedia)

    root.walkRules((rule) => {
      if (HOVER_PATTERN.test(rule.selector) && !isInMedia(rule, HOVER_FEATURE_PATTERN, customMedia)) {
        report({
          ruleName,
          result,
          node: rule,
          message: messages.rejected
        })
      }
    })
  }
}

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages

export default createPlugin(ruleName, ruleFunction)
