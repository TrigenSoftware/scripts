/**
 * Combine all configs
 */

module.exports = {
	overrides: [
		{
			files: [
				'*.js',
				'*.jsx',
				'*.tsx'
			],
			extends: ['./rules/react'].map(require.resolve),
			parserOptions: {
				ecmaFeatures: {
					jsx: true
				}
			},
			rules: {
				'jsdoc/require-param': 'off',
				'jsdoc/require-returns': 'off'
			}
		}
	]
};
