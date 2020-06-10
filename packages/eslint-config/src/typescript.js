/**
 * Combine configs for TypeScript
 */

module.exports = {
	overrides: [{
		files: ['*.ts', '*.tsx'],
		extends: [
			'plugin:@typescript-eslint/recommended'
		].concat([
			'./rules/typescript'
		].map(require.resolve)),
		parser: '@typescript-eslint/parser'
	}]
};
