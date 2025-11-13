/**
 * TypeScript type checked config
 */

import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import { getExtensionRules } from './utils.js'
import typescriptConfig from './typescript.js'
import { tsFiles } from './files.js'

export default [
  ...typescriptConfig,
  {
    files: tsFiles,
    plugins: {
      '@typescript-eslint': typescriptPlugin
    },
    rules: {
      // Rules
      '@typescript-eslint/no-array-delete': 'error',
      '@typescript-eslint/no-base-to-string': 'error',
      '@typescript-eslint/no-deprecated': 'error',
      '@typescript-eslint/no-misused-spread': 'error',
      '@typescript-eslint/no-mixed-enums': 'error',
      '@typescript-eslint/only-throw-error': 'error',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/no-unnecessary-qualifier': 'error',
      '@typescript-eslint/no-unnecessary-template-expression': 'error',
      '@typescript-eslint/no-unnecessary-type-arguments': 'error',
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/prefer-reduce-type-parameter': 'error',
      '@typescript-eslint/prefer-return-this-type': 'error',
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
]
