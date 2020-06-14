/**
 * SCSS config
 */

const {
	camelCaseMatcher
} = require('./cases');

module.exports = {
	plugins: [
		'stylelint-scss'
	],
	rules: {
		// @
		'scss/at-each-key-value-single-line': true,
		'scss/at-else-closing-brace-newline-after': 'always-last-in-chain',
		'scss/at-else-closing-brace-space-after': 'always-intermediate',
		'scss/at-else-empty-line-before': 'never',
		'scss/at-else-if-parentheses-space-before': 'always',
		'scss/at-extend-no-missing-placeholder': true,
		'scss/at-function-parentheses-space-before': 'never',
		'scss/at-function-pattern': camelCaseMatcher,
		'scss/at-if-closing-brace-newline-after': 'always-last-in-chain',
		'scss/at-if-closing-brace-space-after': 'always-intermediate',
		'scss/at-if-no-null': true,
		'scss/at-import-no-partial-leading-underscore': true,
		'scss/at-import-partial-extension': 'never',
		'scss/at-mixin-argumentless-call-parentheses': 'never',
		'scss/at-mixin-parentheses-space-before': 'never',
		'scss/at-mixin-pattern': camelCaseMatcher,
		'scss/at-rule-conditional-no-parentheses': true,
		'at-rule-no-unknown': null,
		'scss/at-rule-no-unknown': true,
		// $
		'scss/dollar-variable-colon-newline-after': 'always-multi-line',
		'scss/dollar-variable-colon-space-after': 'always-single-line',
		'scss/dollar-variable-colon-space-before': 'never',
		'scss/dollar-variable-no-missing-interpolation': true,
		'scss/dollar-variable-pattern': camelCaseMatcher,
		// %
		'scss/percent-placeholder-pattern': camelCaseMatcher,
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
};
