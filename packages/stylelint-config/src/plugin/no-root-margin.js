import stylelint from 'stylelint'

const {
  createPlugin,
  utils: {
    report,
    ruleMessages,
    validateOptions
  }
} = stylelint
const ruleName = 'trigen/no-root-margin'
const messages = ruleMessages(ruleName, {
  rejected: 'A block does not set its own outer margin: where it stands is its consumer\'s. Only `0` and `auto` reset or center it.'
})
// The block's root alone, with its states or modifiers, not an element inside it
const ROOT_SELECTOR_PATTERN = /^\.root(?![\w-])[^\s>+~]*$/
// A nested `&` with no combinator: the rule it stands in, in a state
const NESTED_SAME_PATTERN = /^&[^\s>+~]*$/
const MARGIN_PATTERN = /^margin(-|$)/i
const NEUTRAL_VALUES = new Set(['0', 'auto'])

function isRootRule(rule) {
  return rule.selectors.some((selector) => {
    const trimmed = selector.trim()

    return ROOT_SELECTOR_PATTERN.test(trimmed)
      || (NESTED_SAME_PATTERN.test(trimmed) && rule.parent?.type === 'rule' && isRootRule(rule.parent))
  })
}

function ruleFunction(primary) {
  return (root, result) => {
    if (!validateOptions(result, ruleName, {
      actual: primary
    })) {
      return
    }

    root.walkRules((rule) => {
      if (!isRootRule(rule)) {
        return
      }

      rule.each((node) => {
        if (
          node.type === 'decl'
          && MARGIN_PATTERN.test(node.prop)
          && !node.value.trim().split(/\s+/).every(value => NEUTRAL_VALUES.has(value.toLowerCase()))
        ) {
          report({
            ruleName,
            result,
            node,
            message: messages.rejected
          })
        }
      })
    })
  }
}

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages

export default createPlugin(ruleName, ruleFunction)
