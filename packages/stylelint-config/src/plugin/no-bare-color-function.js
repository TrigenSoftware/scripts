import stylelint from 'stylelint'
import valueParser from 'postcss-value-parser'

const {
  createPlugin,
  utils: {
    report,
    ruleMessages,
    validateOptions
  }
} = stylelint
const ruleName = 'trigen/no-bare-color-function'
const messages = ruleMessages(ruleName, {
  rejected: value => `Expected "${value}" to derive its color from a token: a color function takes only \`var()\`, \`currentcolor\` or \`transparent\`, and a color of its own is a token.`
})
const COLOR_FUNCTIONS = new Set([
  'rgb',
  'rgba',
  'hsl',
  'hsla',
  'hwb',
  'lab',
  'lch',
  'oklab',
  'oklch',
  'color',
  'color-mix'
])
// What a color derives from: the page's own colors, never a color written out
const DERIVED_WORDS = new Set(['currentcolor', 'transparent'])
const PERCENTAGE_PATTERN = /^[\d.]+%$/

function isPart(node) {
  return node.type !== 'space' && node.type !== 'comment'
}

function isColorFunction(node) {
  return node.type === 'function' && COLOR_FUNCTIONS.has(node.value.toLowerCase())
}

/**
 * Check if one color, as an argument of a color function, comes from what the page already has.
 * @param {object[]} nodes - The color's nodes.
 * @returns {boolean} Whether it is a `var()`, `currentcolor`, `transparent` or a function of them.
 */
function isDerivedColor(nodes) {
  const parts = nodes.filter(isPart)

  if (parts.length !== 1) {
    return false
  }

  const [node] = parts

  if (node.type === 'word') {
    return DERIVED_WORDS.has(node.value.toLowerCase())
  }

  if (node.type === 'function' && node.value.toLowerCase() === 'var') {
    return true
  }

  return isColorFunction(node) && isDerivedFunction(node)
}

/**
 * Check if a color function only derives a color: `color-mix()` of derived colors, or the relative
 * syntax, `rgb(from …)` and the like, from a derived color. Channels written out make a color of
 * their own.
 * @param {object} node - The color function.
 * @returns {boolean} Whether it derives its color.
 */
function isDerivedFunction(node) {
  const parts = node.nodes.filter(isPart)

  if (node.value.toLowerCase() === 'color-mix') {
    const colors = [[]]

    parts.forEach((part) => {
      if (part.type === 'div' && part.value === ',') {
        colors.push([])
      } else {
        colors.at(-1).push(part)
      }
    })

    // The first is the space it mixes in
    return colors.length > 1 && colors.slice(1).every(color => isDerivedColor(
      color.filter(part => !(part.type === 'word' && PERCENTAGE_PATTERN.test(part.value)))
    ))
  }

  return parts[0]?.type === 'word'
    && parts[0].value.toLowerCase() === 'from'
    && parts.length > 1
    && isDerivedColor([parts[1]])
}

function ruleFunction(primary) {
  return (root, result) => {
    if (!validateOptions(result, ruleName, {
      actual: primary
    })) {
      return
    }

    root.walkDecls((decl) => {
      valueParser(decl.value).walk((node) => {
        if (!isColorFunction(node)) {
          return undefined
        }

        if (!isDerivedFunction(node)) {
          const value = valueParser.stringify(node)

          report({
            ruleName,
            result,
            node: decl,
            word: value,
            message: messages.rejected(value)
          })
        }

        return false
      })
    })
  }
}

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages

export default createPlugin(ruleName, ruleFunction)
