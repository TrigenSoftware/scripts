import stylelint from 'stylelint'

const {
  createPlugin,
  utils: {
    report,
    ruleMessages,
    validateOptions
  }
} = stylelint
const ruleName = 'trigen/focus-includes-hover'
const messages = ruleMessages(ruleName, {
  rejected: declaration => `Set \`${declaration}\` on focus too: a keyboard reaches what a pointer does, so focus styles include the hover ones.`
})
const HOVER_PATTERN = /:hover(?![\w-])/i
const FOCUS_PATTERN = /:focus(-visible|-within)?(?![\w-])/i
const SPACES_PATTERN = /\s+/g

function toDeclaration(node) {
  return `${node.prop.toLowerCase()}: ${node.value.trim().replace(SPACES_PATTERN, ' ')}`
}

function getDeclarations(rule) {
  return rule.nodes.filter(node => node.type === 'decl')
}

/**
 * Every declaration a `:hover` rule sets, some focus rule of the file sets too, with the same
 * value: a rule whose selector has `:focus`, `:focus-visible` or `:focus-within`, inside `:has()`
 * too. The conditions of the two selectors and their media queries are not compared, so a hover
 * that a busy control loses while its focus stays, or a focus on an input inside the hovered card,
 * passes. A focus look set with another value, or in another file, is not seen.
 * @param {boolean} primary - Whether the rule is on.
 * @returns {Function} The check of a stylesheet.
 */
function ruleFunction(primary) {
  return (root, result) => {
    if (!validateOptions(result, ruleName, {
      actual: primary
    })) {
      return
    }

    const rules = []

    root.walkRules((rule) => {
      rules.push(rule)
    })

    const focused = new Set(
      rules
        .filter(rule => FOCUS_PATTERN.test(rule.selector))
        .flatMap(rule => getDeclarations(rule).map(toDeclaration))
    )

    rules
      .filter(rule => HOVER_PATTERN.test(rule.selector) && !FOCUS_PATTERN.test(rule.selector))
      .forEach((rule) => {
        getDeclarations(rule).forEach((node) => {
          const declaration = toDeclaration(node)

          if (!focused.has(declaration)) {
            report({
              ruleName,
              result,
              node,
              message: messages.rejected(declaration)
            })
          }
        })
      })
  }
}

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages

export default createPlugin(ruleName, ruleFunction)
