/**
 * TypeScript config
 */

const getExtensionRules = require('./getExtensionRules');

module.exports = {
	plugins: [
		'@typescript-eslint'
	],
	rules: {
		// Rules
		'@typescript-eslint/array-type': 'error',
		'@typescript-eslint/await-thenable': 'off',
		'@typescript-eslint/ban-ts-comment': ['error', {
			'ts-expect-error': 'allow-with-description',
			'ts-ignore': 'allow-with-description',
			'ts-nocheck': 'allow-with-description',
			'ts-check': false
		}],
		'@typescript-eslint/consistent-type-definitions': 'error',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/member-delimiter-style': ['error', {
			multiline: {
				delimiter: 'semi',
				requireLast: true
			},
			singleline: {
				delimiter: 'semi',
				requireLast: false
			}
		}],
		'@typescript-eslint/member-ordering': ['error', {
			default: {
				order: 'as-written',
				memberTypes: [
					// Static methods
					'public-static-method',
					'protected-static-method',
					'private-static-method',

					// Static fields
					'public-static-field',
					'protected-static-field',
					'private-static-field',

					// Fields
					'public-decorated-field',
					'protected-decorated-field',
					'private-decorated-field',
					'public-instance-field',
					'protected-instance-field',
					'private-instance-field',
					'public-abstract-field',
					'protected-abstract-field',
					'private-abstract-field',

					// Index signature
					'signature',

					// Constructors
					'public-constructor',
					'protected-constructor',
					'private-constructor',

					// Methods
					'instance-method'
				]
			}
		}],
		'@typescript-eslint/method-signature-style': ['error', 'method'],
		'camelcase': 'off',
		'@typescript-eslint/naming-convention': ['error', {
			selector: 'default',
			format: ['camelCase']
		}, {
			selector: 'variable',
			format: ['camelCase', 'UPPER_CASE']
		}, {
			selector: 'function',
			format: ['camelCase', 'PascalCase']
		}, {
			selector: 'parameter',
			format: ['camelCase'],
			leadingUnderscore: 'allow'
		}, {
			selector: 'typeLike',
			format: ['PascalCase']
		}, {
			selector: 'interface',
			format: ['PascalCase'],
			prefix: ['I']
		}],
		'@typescript-eslint/no-dynamic-delete': 'error',
		'@typescript-eslint/no-explicit-any': 'error',
		'@typescript-eslint/no-extraneous-class': 'error',
		'@typescript-eslint/no-invalid-void-type': 'error',
		'@typescript-eslint/no-namespace': ['error', {
			allowDeclarations: true,
			allowDefinitionFiles: true
		}],
		'@typescript-eslint/no-require-imports': 'error',
		'@typescript-eslint/no-this-alias': ['error', {
			allowDestructuring: true,
			allowedNames: ['self']
		}],
		'@typescript-eslint/no-unused-vars-experimental': 'error',
		'@typescript-eslint/prefer-for-of': 'error',
		'@typescript-eslint/prefer-function-type': 'error',
		'@typescript-eslint/prefer-namespace-keyword': 'off',
		'@typescript-eslint/prefer-optional-chain': 'error',
		'@typescript-eslint/prefer-ts-expect-error': 'error',
		'@typescript-eslint/type-annotation-spacing': 'error',
		'@typescript-eslint/unified-signatures': 'error',

		// Extension
		...getExtensionRules([
			'brace-style',
			'comma-spacing',
			'default-param-last',
			'func-call-spacing',
			'indent',
			'init-declarations',
			'keyword-spacing',
			'lines-between-class-members',
			'no-array-constructor',
			'no-empty-function',
			'no-extra-parens',
			'no-magic-numbers',
			'no-unused-expressions',
			'no-unused-vars',
			'no-use-before-define',
			'no-useless-constructor',
			'quotes',
			'semi',
			'space-before-function-paren'
		]),
		// Override eslint:recommended
		'no-dupe-class-members': 'off',
		'@typescript-eslint/no-dupe-class-members': 'error',
		'no-extra-semi': 'off',
		'@typescript-eslint/no-extra-semi': 'error'
	}
};
