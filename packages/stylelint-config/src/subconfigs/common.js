/**
 * Common config
 */

import concentricCss from './concentric-css.js'
import {
  pascalCaseMatcher,
  camelCaseMatcher
} from './matchers.js'

export default {
  plugins: [
    '@stylistic/stylelint-plugin',
    'stylelint-order',
    'stylelint-plugin-a11y',
    'stylelint-high-performance-animation',
    'stylelint-gamut'
  ],
  rules: {
    // Plugins
    // Order
    'order/order': [
      'dollar-variables',
      'custom-properties',
      'declarations',
      'rules',
      'at-rules'
    ],
    'order/properties-order': [
      concentricCss.map(properties => ({
        emptyLineBefore: 'never',
        properties
      })),
      {
        unspecified: 'bottom'
      }
    ],
    // A11y
    'a11y/font-size-is-readable': true,
    'a11y/media-prefers-reduced-motion': true,
    'a11y/no-obsolete-attribute': true,
    'a11y/no-obsolete-element': true,
    'a11y/no-outline-none': true,
    'a11y/no-text-align-justify': true,
    'a11y/selector-pseudo-class-focus': true,
    // High performance animation
    'plugin/no-low-performance-animation-properties': [
      true,
      {
        ignore: 'paint-properties'
      }
    ],
    // Gamut
    'gamut/color-no-out-gamut-range': true,

    // Possible errors
    // Colors
    'color-no-invalid-hex': true,
    // Font family
    'font-family-no-duplicate-names': true,
    'font-family-no-missing-generic-family-keyword': true,
    // Function
    'function-calc-no-unspaced-operator': true,
    'function-linear-gradient-no-nonstandard-direction': true,
    // String
    'string-no-newline': true,
    // Unit
    'unit-no-unknown': true,
    // Property
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['composes']
      }
    ],
    // Keyframe declaration
    'keyframe-declaration-no-important': true,
    // Declaration block
    'declaration-block-no-duplicate-properties': [
      true,
      {
        ignore: ['consecutive-duplicates-with-different-values']
      }
    ],
    'declaration-block-no-shorthand-property-overrides': true,
    // Block
    'block-no-empty': true,
    // Selector
    'selector-pseudo-class-no-unknown': true,
    'selector-pseudo-element-no-unknown': true,
    'selector-type-no-unknown': true,
    // Media feature
    'media-feature-name-no-unknown': true,
    // At-rule
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['value']
      }
    ],
    // Comment
    'comment-no-empty': true,
    // General / Sheet
    'no-descending-specificity': true,
    'no-duplicate-at-import-rules': true,
    'no-duplicate-selectors': true,
    'no-empty-source': true,
    '@stylistic/no-extra-semicolons': true,
    'no-invalid-double-slash-comments': true,

    // Limit language features
    // Alpha-value
    'alpha-value-notation': 'number',
    // Hue
    'hue-degree-notation': 'angle',
    // Color
    'color-function-notation': 'legacy',
    'color-named': 'always-where-possible',
    // Length
    'length-zero-no-unit': true,
    // Font weight
    'font-weight-notation': 'named-where-possible',
    // Function
    'function-url-no-scheme-relative': true,
    'function-url-scheme-allowed-list': ['data', 'https'],
    // Keyframes
    'keyframes-name-pattern': [
      pascalCaseMatcher,
      {
        message: 'Expected keyframe name to be in PascalCase (e.g. "FadeIn", "SlideUp")'
      }
    ],
    // Number
    'number-max-precision': 3,
    // Time
    'time-min-milliseconds': [
      100,
      {
        ignore: ['delay']
      }
    ],
    // Shorthand property
    'shorthand-property-no-redundant-values': true,
    // Value
    'value-no-vendor-prefix': true,
    // Custom property
    'custom-property-pattern': [
      camelCaseMatcher,
      {
        message: 'Expected custom property name to be in camelCase (e.g. "--colorPrimary", "--sizeFont")'
      }
    ],
    // Property
    'property-no-vendor-prefix': true,
    // Declaration
    'declaration-block-no-redundant-longhand-properties': true,
    // Declaration block
    'declaration-block-single-line-max-declarations': 0,
    // Selector
    'selector-class-pattern': [
      camelCaseMatcher,
      {
        resolveNestedSelectors: true,
        message: 'Expected class selector to be in camelCase (e.g. ".button", ".navMenu")'
      }
    ],
    'selector-max-compound-selectors': 4,
    'selector-max-universal': 1,
    '@stylistic/selector-max-empty-lines': 0,
    'selector-no-qualifying-type': [
      true,
      {
        ignore: ['attribute']
      }
    ],
    'selector-no-vendor-prefix': true,
    'selector-pseudo-element-colon-notation': 'double',
    // Media feature
    'media-feature-name-no-vendor-prefix': true,
    // Custom media
    'custom-media-pattern': [
      camelCaseMatcher,
      {
        message: 'Expected custom media query name to be in camelCase (e.g. "--mediaSmallScreen", "--mediaTabletAndUp")'
      }
    ],
    // At-rule
    'at-rule-no-vendor-prefix': true,
    'at-rule-property-required-list': {
      'font-face': [
        'font-display',
        'font-family',
        'font-style',
        'font-weight',
        'src'
      ]
    },
    // General / Sheet
    'no-unknown-animations': true,

    // Stylistic issues
    // Color
    '@stylistic/color-hex-case': 'lower',
    'color-hex-length': 'short',
    // Font family
    'font-family-name-quotes': 'always-where-recommended',
    // Function
    '@stylistic/function-comma-newline-after': 'always-multi-line',
    '@stylistic/function-comma-newline-before': 'never-multi-line',
    '@stylistic/function-comma-space-after': 'always-single-line',
    '@stylistic/function-comma-space-before': 'never',
    '@stylistic/function-max-empty-lines': 0,
    'function-name-case': 'lower',
    '@stylistic/function-parentheses-newline-inside': 'always-multi-line',
    '@stylistic/function-parentheses-space-inside': 'never-single-line',
    'function-url-quotes': [
      'always',
      {
        except: ['empty']
      }
    ],
    '@stylistic/function-whitespace-after': 'always',
    // Number
    '@stylistic/number-leading-zero': 'never',
    '@stylistic/number-no-trailing-zeros': true,
    // String
    '@stylistic/string-quotes': 'single',
    // Unit
    '@stylistic/unit-case': 'lower',
    // Value
    'value-keyword-case': 'lower',
    // Value list
    '@stylistic/value-list-comma-newline-after': 'always-multi-line',
    '@stylistic/value-list-comma-newline-before': 'never-multi-line',
    '@stylistic/value-list-comma-space-after': 'always-single-line',
    '@stylistic/value-list-comma-space-before': 'never',
    '@stylistic/value-list-max-empty-lines': 0,
    // Custom property
    'custom-property-empty-line-before': 'never',
    // Property
    '@stylistic/property-case': 'lower',
    // Declaration
    '@stylistic/declaration-bang-space-after': 'never',
    '@stylistic/declaration-bang-space-before': 'always',
    '@stylistic/declaration-colon-newline-after': 'always-multi-line',
    '@stylistic/declaration-colon-space-after': 'always-single-line',
    '@stylistic/declaration-colon-space-before': 'never',
    // Declaration block
    '@stylistic/declaration-block-semicolon-newline-after': 'always',
    '@stylistic/declaration-block-semicolon-newline-before': 'never-multi-line',
    '@stylistic/declaration-block-semicolon-space-after': 'always-single-line',
    '@stylistic/declaration-block-semicolon-space-before': 'never',
    '@stylistic/declaration-block-trailing-semicolon': 'always',
    // Block
    '@stylistic/block-closing-brace-empty-line-before': 'never',
    '@stylistic/block-closing-brace-newline-after': 'always',
    '@stylistic/block-closing-brace-newline-before': 'always',
    '@stylistic/block-closing-brace-space-after': 'always-single-line',
    '@stylistic/block-closing-brace-space-before': 'always-single-line',
    '@stylistic/block-opening-brace-newline-after': 'always',
    '@stylistic/block-opening-brace-newline-before': 'never-single-line',
    '@stylistic/block-opening-brace-space-after': 'always-single-line',
    '@stylistic/block-opening-brace-space-before': 'always',
    // Selector
    '@stylistic/selector-attribute-brackets-space-inside': 'never',
    '@stylistic/selector-attribute-operator-space-after': 'never',
    '@stylistic/selector-attribute-operator-space-before': 'never',
    'selector-attribute-quotes': 'never',
    '@stylistic/selector-combinator-space-after': 'always',
    '@stylistic/selector-combinator-space-before': 'always',
    '@stylistic/selector-descendant-combinator-no-non-space': true,
    '@stylistic/selector-pseudo-class-case': 'lower',
    '@stylistic/selector-pseudo-class-parentheses-space-inside': 'never',
    '@stylistic/selector-pseudo-element-case': 'lower',
    'selector-type-case': 'lower',
    // Selector list
    '@stylistic/selector-list-comma-newline-after': 'always-multi-line',
    '@stylistic/selector-list-comma-newline-before': 'never-multi-line',
    '@stylistic/selector-list-comma-space-after': 'always-single-line',
    '@stylistic/selector-list-comma-space-before': 'never',
    // Rule
    'rule-empty-line-before': [
      'always',
      {
        except: ['first-nested', 'after-single-line-comment']
      }
    ],
    // Media feature
    '@stylistic/media-feature-colon-space-after': 'always',
    '@stylistic/media-feature-colon-space-before': 'never',
    '@stylistic/media-feature-name-case': 'lower',
    '@stylistic/media-feature-parentheses-space-inside': 'never',
    '@stylistic/media-feature-range-operator-space-after': 'always',
    '@stylistic/media-feature-range-operator-space-before': 'always',
    // Media query list
    '@stylistic/media-query-list-comma-newline-after': 'always-multi-line',
    '@stylistic/media-query-list-comma-newline-before': 'never-multi-line',
    '@stylistic/media-query-list-comma-space-after': 'always-single-line',
    '@stylistic/media-query-list-comma-space-before': 'never',
    // At-rule
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['blockless-after-same-name-blockless', 'first-nested'],
        ignore: ['after-comment']
      }
    ],
    '@stylistic/at-rule-name-case': 'lower',
    '@stylistic/at-rule-name-newline-after': 'always-multi-line',
    '@stylistic/at-rule-name-space-after': 'always-single-line',
    '@stylistic/at-rule-semicolon-newline-after': 'always',
    '@stylistic/at-rule-semicolon-space-before': 'never',
    // Comment
    'comment-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment', 'stylelint-commands']
      }
    ],
    'comment-whitespace-inside': 'always',
    // General / Sheet
    '@stylistic/indentation': [
      2,
      {
        indentClosingBrace: false
      }
    ],
    '@stylistic/linebreaks': 'unix',
    '@stylistic/max-empty-lines': 1,
    '@stylistic/no-eol-whitespace': true,
    '@stylistic/no-missing-end-of-source-newline': true,
    '@stylistic/no-empty-first-line': true,
    '@stylistic/unicode-bom': 'never'
  }
}
