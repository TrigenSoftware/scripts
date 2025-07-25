/**
 * SCSS config
 */

import scss from 'postcss-scss'
import commonConfig from './common.js'
import { camelCaseMatcher } from './matchers.js'

const { rules: commonRules } = commonConfig

export default {
  plugins: ['stylelint-scss'],
  customSyntax: scss,
  rules: {
    // @
    'scss/at-each-key-value-single-line': true,
    'scss/at-else-closing-brace-newline-after': 'always-last-in-chain',
    'scss/at-else-closing-brace-space-after': 'always-intermediate',
    'scss/at-else-empty-line-before': 'never',
    'at-rule-empty-line-before': [
      commonRules['at-rule-empty-line-before'][0],
      {
        ...commonRules['at-rule-empty-line-before'][1],
        ignoreAtRules: ['else']
      }
    ],
    'scss/at-else-if-parentheses-space-before': 'always',
    'scss/at-extend-no-missing-placeholder': true,
    'scss/at-function-parentheses-space-before': 'never',
    'scss/at-function-pattern': [
      camelCaseMatcher,
      {
        message: 'Expected SCSS function name to be in camelCase (e.g. "calculateWidth", "getColor")'
      }
    ],
    'function-name-case': [
      commonRules['function-name-case'],
      {
        ignoreFunctions: [camelCaseMatcher]
      }
    ],
    'scss/at-if-closing-brace-newline-after': 'always-last-in-chain',
    'scss/at-if-closing-brace-space-after': 'always-intermediate',
    '@stylistic/block-closing-brace-newline-after': [
      commonRules['@stylistic/block-closing-brace-newline-after'],
      {
        ignoreAtRules: ['if', 'else']
      }
    ],
    'scss/at-if-no-null': true,
    'scss/load-no-partial-leading-underscore': true,
    'scss/load-partial-extension': 'never',
    'scss/at-mixin-argumentless-call-parentheses': 'never',
    'scss/at-mixin-parentheses-space-before': 'never',
    'scss/at-mixin-pattern': [
      camelCaseMatcher,
      {
        message: 'Expected SCSS mixin name to be in camelCase (e.g. "buttonStyle", "flexCenter")'
      }
    ],
    'scss/at-rule-conditional-no-parentheses': true,
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': commonRules['at-rule-no-unknown'],
    // $
    'scss/dollar-variable-colon-newline-after': 'always-multi-line',
    'scss/dollar-variable-colon-space-after': 'always-single-line',
    'scss/dollar-variable-colon-space-before': 'never',
    'scss/dollar-variable-no-missing-interpolation': true,
    'scss/dollar-variable-pattern': [
      camelCaseMatcher,
      {
        message: 'Expected SCSS variable name to be in camelCase (e.g. "$primaryColor", "$fontSize")'
      }
    ],
    // %
    'scss/percent-placeholder-pattern': [
      camelCaseMatcher,
      {
        message: 'Expected SCSS placeholder name to be in camelCase (e.g. "%buttonBase", "%clearfix")'
      }
    ],
    // //
    'scss/double-slash-comment-whitespace-inside': 'always',
    // Comment
    'scss/comment-no-empty': true,
    // Declaration
    'scss/declaration-nested-properties': 'never',
    'scss/declaration-nested-properties-no-divided-groups': true,
    // Dimension
    'scss/dimension-no-non-numeric-values': true,
    // Function
    'scss/function-quote-no-quoted-strings-inside': true,
    'scss/function-unquote-no-unquoted-strings-inside': true,
    // Operator
    'scss/operator-no-newline-after': true,
    'scss/operator-no-newline-before': true,
    'scss/operator-no-unspaced': true,
    // Partial
    'scss/partial-no-import': true,
    // Selector
    'scss/selector-no-redundant-nesting-selector': true,
    // General / Sheet
    'scss/no-duplicate-dollar-variables': true,
    'scss/no-duplicate-mixins': true,
    'scss/no-global-function-names': true
  }
}
