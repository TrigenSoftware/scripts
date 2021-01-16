/**
 * Stylable config
 */

const {
	rules: commonRules
} = require('./common');
const {
	camelCaseMatcher
} = require('./cases');

module.exports = {
	plugins: [
		'stylelint-order'
	],
	rules: {
		'order/properties-order': [require('./concentric-stylable').map(properties => ({
			emptyLineBefore: 'never',
			properties
		})), {
			unspecified: 'bottom'
		}],
		'selector-type-case': null,
		'selector-type-no-unknown': null,
		'selector-pseudo-class-case': null,
		'selector-pseudo-class-no-unknown': null,
		'selector-pseudo-element-case': null,
		'selector-pseudo-element-no-unknown': null,
		'no-duplicate-selectors': null,
		'property-case': null,
		// 'property-no-unknown':                [true, {
		// 	ignoreProperties: [/^[a-z][a-z0-9]*([A-Z0-9][a-z0-9]*)*$/]
		// }],
		'function-name-case': [
			commonRules['function-name-case'],
			{
				ignoreFunctions: [camelCaseMatcher]
			}
		],
		'value-keyword-case': null
	}
};
