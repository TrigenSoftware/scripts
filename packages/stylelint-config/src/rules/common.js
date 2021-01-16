/**
 * Common config
 */

const {
	pascalCaseMatcher,
	camelCaseMatcher,
	classNameMatcher
} = require('./cases');

module.exports = {
	plugins: [
		'stylelint-declaration-strict-value',
		'stylelint-order',
		'stylelint-a11y',
		'stylelint-high-performance-animation'
	],
	rules: {
		// Plugins
		// Strict value
		'scale-unlimited/declaration-strict-value': [[
			'font-family',
			'/color([^A-Z]|$)/'
		], {
			ignoreKeywords: ['currentColor', 'transparent', 'inherit']
		}],
		// Order
		'order/order': [
			'dollar-variables',
			'custom-properties',
			'declarations',
			'rules',
			'at-rules'
		],
		'order/properties-order': [require('./concentric-css').map(properties => ({
			emptyLineBefore: 'never',
			properties
		})), {
			unspecified: 'bottom'
		}],
		// A11y
		'a11y/font-size-is-readable': true,
		'a11y/line-height-is-vertical-rhythmed': [true, {
			severity: 'warning'
		}],
		'a11y/media-prefers-reduced-motion': true,
		'a11y/no-display-none': [true, {
			severity: 'warning'
		}],
		'a11y/no-obsolete-attribute': true,
		'a11y/no-obsolete-element': true,
		'a11y/no-outline-none': true,
		'a11y/no-text-align-justify': true,
		'a11y/selector-pseudo-class-focus': true,
		// High perfomance animation
		'plugin/no-low-performance-animation-properties': [true, {
			ignore: 'paint-properties'
		}],

		// Possible errors
		// Colors
		'color-no-invalid-hex': true,
		// Font family
		'font-family-no-duplicate-names': true,
		'font-family-no-missing-generic-family-keyword': true,
		// Function
		'function-calc-no-invalid': true,
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
		'declaration-block-no-duplicate-properties': [true, {
			ignore: ['consecutive-duplicates-with-different-values']
		}],
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
		'no-extra-semicolons': true,
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
		'function-url-scheme-whitelist': ['data', 'https'],
		// Keyframes
		'keyframes-name-pattern': pascalCaseMatcher,
		// Number
		'number-max-precision': 3,
		// Time
		'time-min-milliseconds': [100, {
			ignore: ['delay']
		}],
		// Shorthand property
		'shorthand-property-no-redundant-values': true,
		// Value
		'value-no-vendor-prefix': true,
		// Custom property
		'custom-property-pattern': camelCaseMatcher,
		// Property
		'property-no-vendor-prefix': true,
		// Declaration
		'declaration-block-no-redundant-longhand-properties': true,
		// Declaration block
		'declaration-block-single-line-max-declarations': 0,
		// Selector
		'selector-class-pattern': [classNameMatcher, {
			resolveNestedSelectors: true
		}],
		'selector-max-compound-selectors': 4,
		'selector-max-universal': 1,
		'selector-max-empty-lines': 0,
		'selector-no-qualifying-type': [true, {
			ignore: ['attribute']
		}],
		'selector-no-vendor-prefix': true,
		'selector-pseudo-element-colon-notation': 'double',
		// Media feature
		'media-feature-name-no-vendor-prefix': true,
		// Custom media
		'custom-media-pattern': camelCaseMatcher,
		// At-rule
		'at-rule-no-vendor-prefix': true,
		'at-rule-property-requirelist': {
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
		'color-hex-case': 'lower',
		'color-hex-length': 'short',
		// Font family
		'font-family-name-quotes': 'always-where-recommended',
		// Function
		'function-comma-newline-after': 'always-multi-line',
		'function-comma-newline-before': 'never-multi-line',
		'function-comma-space-after': 'always-single-line',
		'function-comma-space-before': 'never',
		'function-max-empty-lines': 0,
		'function-name-case': 'lower',
		'function-parentheses-newline-inside': 'always-multi-line',
		'function-parentheses-space-inside': 'never-single-line',
		'function-url-quotes': ['always', {
			except: ['empty']
		}],
		'function-whitespace-after': 'always',
		// Number
		'number-leading-zero': 'never',
		'number-no-trailing-zeros': true,
		// String
		'string-quotes': 'single',
		// Unit
		'unit-case': 'lower',
		// Value
		'value-keyword-case': 'lower',
		// Value list
		'value-list-comma-newline-after': 'always-multi-line',
		'value-list-comma-newline-before': 'never-multi-line',
		'value-list-comma-space-after': 'always-single-line',
		'value-list-comma-space-before': 'never',
		'value-list-max-empty-lines': 0,
		// Custom property
		'custom-property-empty-line-before': 'never',
		// Property
		'property-case': 'lower',
		// Declaration
		'declaration-bang-space-after': 'never',
		'declaration-bang-space-before': 'always',
		'declaration-colon-newline-after': 'always-multi-line',
		'declaration-colon-space-after': 'always-single-line',
		'declaration-colon-space-before': 'never',
		'declaration-empty-line-before': 'never',
		// Declaration block
		'declaration-block-semicolon-newline-after': 'always',
		'declaration-block-semicolon-newline-before': 'never-multi-line',
		'declaration-block-semicolon-space-after': 'always-single-line',
		'declaration-block-semicolon-space-before': 'never',
		'declaration-block-trailing-semicolon': 'always',
		// Block
		'block-closing-brace-empty-line-before': 'never',
		'block-closing-brace-newline-after': 'always',
		'block-closing-brace-newline-before': 'always',
		'block-closing-brace-space-after': 'always-single-line',
		'block-closing-brace-space-before': 'always-single-line',
		'block-opening-brace-newline-after': 'always',
		'block-opening-brace-newline-before': 'never-single-line',
		'block-opening-brace-space-after': 'always-single-line',
		'block-opening-brace-space-before': 'always',
		// Selector
		'selector-attribute-brackets-space-inside': 'never',
		'selector-attribute-operator-space-after': 'never',
		'selector-attribute-operator-space-before': 'never',
		'selector-attribute-quotes': 'never',
		'selector-combinator-space-after': 'always',
		'selector-combinator-space-before': 'always',
		'selector-descendant-combinator-no-non-space': true,
		'selector-pseudo-class-case': 'lower',
		'selector-pseudo-class-parentheses-space-inside': 'never',
		'selector-pseudo-element-case': 'lower',
		'selector-type-case': 'lower',
		// Selector list
		'selector-list-comma-newline-after': 'always-multi-line',
		'selector-list-comma-newline-before': 'never-multi-line',
		'selector-list-comma-space-after': 'always-single-line',
		'selector-list-comma-space-before': 'never',
		// Rule
		'rule-empty-line-before': ['always', {
			except: ['after-single-line-comment']
		}],
		// Media feature
		'media-feature-colon-space-after': 'always',
		'media-feature-colon-space-before': 'never',
		'media-feature-name-case': 'lower',
		'media-feature-parentheses-space-inside': 'never',
		'media-feature-range-operator-space-after': 'always',
		'media-feature-range-operator-space-before': 'always',
		// Media query list
		'media-query-list-comma-newline-after': 'always-multi-line',
		'media-query-list-comma-newline-before': 'never-multi-line',
		'media-query-list-comma-space-after': 'always-single-line',
		'media-query-list-comma-space-before': 'never',
		// At-rule
		'at-rule-empty-line-before': ['always', {
			except: ['blockless-after-same-name-blockless', 'first-nested'],
			ignore: ['after-comment']
		}],
		'at-rule-name-case': 'lower',
		'at-rule-name-newline-after': 'always-multi-line',
		'at-rule-name-space-after': 'always-single-line',
		'at-rule-semicolon-newline-after': 'always',
		'at-rule-semicolon-space-before': 'never',
		// Comment
		'comment-empty-line-before': ['always', {
			except: ['first-nested'],
			ignore: ['after-comment', 'stylelint-commands']
		}],
		'comment-whitespace-inside': 'always',
		// General / Sheet
		'indentation': ['tab', {
			indentClosingBrace: false
		}],
		'linebreaks': 'unix',
		'max-empty-lines': 1,
		'no-eol-whitespace': true,
		'no-missing-end-of-source-newline': true,
		'no-empty-first-line': true,
		'unicode-bom': 'never'
	}
};
