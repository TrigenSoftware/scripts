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
const ruleName = 'trigen/no-bare-length'
const messages = ruleMessages(ruleName, {
  rejected: value => `Expected a token or a calc of tokens for "${value}": a value no scale owns is a custom property of the component.`
})
// Absolute and font-relative lengths and times; proportions (`%`, `fr`, `lh`) and viewport and
// container units are not a scale's
const UNITS = new Set([
  'px',
  'rem',
  'em',
  'ex',
  'ch',
  'cap',
  'ic',
  'rex',
  'rch',
  'rcap',
  'ric',
  'pt',
  'pc',
  'in',
  'cm',
  'mm',
  'q',
  'ms',
  's'
])
const SKIPPED_FUNCTIONS = new Set(['var', 'url', 'env'])

function ruleFunction(primary) {
  return (root, result) => {
    if (!validateOptions(result, ruleName, {
      actual: primary
    })) {
      return
    }

    root.walkDecls((decl) => {
      // A custom property is where a value no scale owns is named
      if (decl.prop.startsWith('--')) {
        return
      }

      valueParser(decl.value).walk((node) => {
        if (node.type === 'function' && SKIPPED_FUNCTIONS.has(node.value.toLowerCase())) {
          return false
        }

        const dimension = node.type === 'word' ? valueParser.unit(node.value) : false

        if (dimension && UNITS.has(dimension.unit.toLowerCase()) && Number(dimension.number) !== 0) {
          report({
            ruleName,
            result,
            node: decl,
            word: node.value,
            message: messages.rejected(node.value)
          })
        }

        return undefined
      })
    })
  }
}

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages

export default createPlugin(ruleName, ruleFunction)
