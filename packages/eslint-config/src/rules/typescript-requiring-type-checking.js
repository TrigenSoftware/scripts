/**
 * TypeScript requiring type checking config
 */

const getExtensionRules = require('./getExtensionRules')

module.exports = {
  plugins: ['@typescript-eslint'],
  rules: {
    // Rules
    '@typescript-eslint/no-base-to-string': 'error',
    '@typescript-eslint/no-throw-literal': 'error',
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
    '@typescript-eslint/no-unnecessary-qualifier': 'error',
    '@typescript-eslint/no-unnecessary-type-arguments': 'error',
    '@typescript-eslint/prefer-includes': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-readonly': 'error',
    '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    '@typescript-eslint/prefer-reduce-type-parameter': 'error',
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/unbound-method': [
      'off',
      {
        ignoreStatic: true
      }
    ],

    // Extension
    ...getExtensionRules('@typescript-eslint', ['dot-notation', 'require-await']),
    'no-void': [
      // due to @typescript-eslint/no-floating-promises
      'error',
      {
        allowAsStatement: true
      }
    ]
  }
}
