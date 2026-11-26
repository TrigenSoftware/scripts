import stylelint from 'stylelint'

const {
  createPlugin,
  utils: {
    report,
    ruleMessages,
    validateOptions
  }
} = stylelint
const ruleName = 'trigen/no-root-placement'
const messages = ruleMessages(ruleName, {
  outOfFlow: 'A block does not take itself out of the flow: where it stands is its consumer\'s. Only `relative` and `static` keep it in its place.',
  hidden: 'A block does not hide itself at a breakpoint: whether it shows there is its consumer\'s.'
})
// The block's root alone, with its states or modifiers, not an element inside it, nor its
// pseudo-elements, which are its own parts placed inside it
const ROOT_SELECTOR_PATTERN = /^\.root(?![\w-])(?!.*::)[^\s>+~]*$/
// A nested `&` with no combinator: the rule it stands in, in a state
const NESTED_SAME_PATTERN = /^&(?!.*::)[^\s>+~]*$/
const OUT_OF_FLOW_VALUES = new Set(['absolute', 'fixed', 'sticky'])
// What shows a rule at some widths and not at others
const BREAKPOINT_AT_RULES = new Set(['media', 'container'])

function parentRule(node) {
  let parent = node.parent

  while (parent && parent.type !== 'rule' && parent.type !== 'root') {
    parent = parent.parent
  }

  return parent?.type === 'rule' ? parent : null
}

function isRootRule(rule) {
  return rule.selectors.some((selector) => {
    const trimmed = selector.trim()

    if (ROOT_SELECTOR_PATTERN.test(trimmed)) {
      return true
    }

    const outer = NESTED_SAME_PATTERN.test(trimmed) ? parentRule(rule) : null

    return outer !== null && isRootRule(outer)
  })
}

function inBreakpoint(node) {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (parent.type === 'atrule' && BREAKPOINT_AT_RULES.has(parent.name.toLowerCase())) {
      return true
    }
  }

  return false
}

function ruleFunction(primary) {
  return (root, result) => {
    if (!validateOptions(result, ruleName, {
      actual: primary
    })) {
      return
    }

    root.walkDecls((decl) => {
      const rule = parentRule(decl)

      if (!rule || !isRootRule(rule)) {
        return
      }

      const prop = decl.prop.toLowerCase()
      const value = decl.value.trim().toLowerCase()

      if (prop === 'position' && OUT_OF_FLOW_VALUES.has(value)) {
        report({
          ruleName,
          result,
          node: decl,
          message: messages.outOfFlow
        })
      } else if (prop === 'display' && value === 'none' && inBreakpoint(decl)) {
        report({
          ruleName,
          result,
          node: decl,
          message: messages.hidden
        })
      }
    })
  }
}

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages

export default createPlugin(ruleName, ruleFunction)
