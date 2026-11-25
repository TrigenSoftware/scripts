import selectorParser from 'postcss-selector-parser'
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
const STATES_PATTERN = /^:(is|where)$/i

function isHover(node) {
  return node.type === 'pseudo' && node.value.toLowerCase() === ':hover'
}

// `:hover` itself, or an `:is()` or `:where()` that lists it among states
function isHoverState(node) {
  return isHover(node) || (
    node.type === 'pseudo'
    && STATES_PATTERN.test(node.value)
    && node.nodes.some(state => state.nodes.length === 1 && isHover(state.first))
  )
}

function normalize(selector) {
  return selector.toString().trim().replace(/\s+/g, ' ')
}

/**
 * Check if every hovered selector of a list stands beside itself at rest, as in
 * `.item[aria-current], .item[aria-current]:is(:hover, :active)`: such a hover pins the look the
 * element has at rest against the states' rules, so a tap leaves nothing behind.
 * @param {string} selectorList - A rule's selector list.
 * @returns {boolean} Whether its hover only pins the look at rest.
 */
function isPinned(selectorList) {
  let selectors

  try {
    selectors = selectorParser().astSync(selectorList).nodes
  } catch {
    return false
  }

  const atRest = new Set(selectors.map(normalize))

  return selectors.filter(selector => HOVER_PATTERN.test(selector.toString())).every((selector) => {
    const rest = selector.clone()
    const states = rest.nodes.filter(isHoverState)

    states.forEach(state => state.remove())

    return states.length > 0 && atRest.has(normalize(rest))
  })
}

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
      if (
        HOVER_PATTERN.test(rule.selector)
        && !isInMedia(rule, HOVER_FEATURE_PATTERN, customMedia)
        && !isPinned(rule.selector)
      ) {
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
