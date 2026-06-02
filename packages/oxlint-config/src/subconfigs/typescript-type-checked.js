/**
 * TypeScript type checked config
 */

import typescriptConfig from './typescript.js'
import { tsFiles } from './files.js'

export default {
  extends: [typescriptConfig],
  overrides: [
    {
      files: tsFiles,
      plugins: ['typescript'],
      rules: {
        // Recommended type checked
        'typescript/no-array-delete': 'error',
        'typescript/no-base-to-string': 'error',
        'typescript/no-duplicate-type-constituents': 'error',
        'typescript/no-floating-promises': 'error',
        'typescript/no-for-in-array': 'error',
        'eslint/no-implied-eval': 'off',
        'typescript/no-implied-eval': 'error',
        'typescript/no-misused-promises': 'error',
        'typescript/no-redundant-type-constituents': 'error',
        'typescript/no-unnecessary-type-assertion': 'error',
        'typescript/no-unsafe-argument': 'error',
        'typescript/no-unsafe-assignment': 'error',
        'typescript/no-unsafe-call': 'error',
        'typescript/no-unsafe-enum-comparison': 'error',
        'typescript/no-unsafe-member-access': 'error',
        'typescript/no-unsafe-return': 'error',
        'typescript/no-unsafe-unary-minus': 'error',
        'eslint/no-throw-literal': 'off',
        'typescript/only-throw-error': 'error',
        'eslint/prefer-promise-reject-errors': 'off',
        'typescript/prefer-promise-reject-errors': 'error',
        'eslint/require-await': 'off',
        'typescript/require-await': 'error',
        'typescript/restrict-plus-operands': 'error',
        'typescript/restrict-template-expressions': 'error',
        'typescript/unbound-method': [
          'off',
          {
            ignoreStatic: true
          }
        ],

        // Rules
        'typescript/no-deprecated': 'error',
        'typescript/no-misused-spread': 'error',
        'typescript/no-mixed-enums': 'error',
        'typescript/no-unnecessary-boolean-literal-compare': 'error',
        'typescript/no-unnecessary-qualifier': 'error',
        'typescript/no-unnecessary-template-expression': 'error',
        'typescript/no-unnecessary-type-arguments': 'error',
        'typescript/consistent-type-imports': 'error',
        'typescript/prefer-includes': 'error',
        'typescript/prefer-nullish-coalescing': 'off',
        'typescript/prefer-optional-chain': 'error',
        'typescript/prefer-readonly': 'error',
        'typescript/prefer-readonly-parameter-types': 'off',
        'typescript/prefer-reduce-type-parameter': 'error',
        'typescript/prefer-return-this-type': 'error',
        'typescript/prefer-string-starts-ends-with': 'error',
        'typescript/switch-exhaustiveness-check': 'error'
      }
    }
  ]
}
