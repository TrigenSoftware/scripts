/**
 * Jest override
 */

module.exports = {
	plugins: [
		'jest'
	],
	env: {
		'jest/globals': true
	},
	rules: {
		'no-magic-numbers': 'off',
		'import/order': 'off'
	}
};
