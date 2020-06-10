/**
 * Combine configs for TypeScript
 */

module.exports = {
	extends: [
		'plugin:@typescript-eslint/recommended'
	].concat([
		'./rules/typescript'
	].map(require.resolve)),
	parser: '@typescript-eslint/parser'
};
