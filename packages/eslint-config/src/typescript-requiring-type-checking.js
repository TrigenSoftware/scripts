/**
 * Combine configs for TypeScript
 */

module.exports = {
	overrides: [{
		files: ['*.ts', '*.tsx'],
		extends: [
			'plugin:@typescript-eslint/recommended-requiring-type-checking'
		].concat([
			'./rules/typescript-requiring-type-checking'
		].map(require.resolve)),
		parser: '@typescript-eslint/parser'
	}]
};
