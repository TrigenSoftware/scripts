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
const ruleName = 'trigen/thin-scrollbar-in-media'
const messages = ruleMessages(ruleName, {
  rejected: 'Make a scrollbar thin for a mouse alone, in a pointer media query: a finger keeps the overlay one.'
})
const POINTER_FEATURE_PATTERN = /\(\s*(any-)?pointer\s*:\s*fine\s*\)/i

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

    root.walkDecls(/^scrollbar-width$/i, (decl) => {
      if (decl.value.trim().toLowerCase() === 'thin' && !isInMedia(decl, POINTER_FEATURE_PATTERN, customMedia)) {
        report({
          ruleName,
          result,
          node: decl,
          message: messages.rejected
        })
      }
    })
  }
}

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages

export default createPlugin(ruleName, ruleFunction)
