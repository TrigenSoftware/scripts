/**
 * Test override
 */

import { testFiles } from './subconfigs/files.js'

export default {
  overrides: [
    {
      // Tests live in `*.spec.*` files beside their code, never in `*.test.*` ones
      files: ['**/*'],
      plugins: ['vitest'],
      rules: {
        'vitest/consistent-test-filename': [
          'error',
          {
            pattern: '.*\\.spec\\.[jt]sx?$'
          }
        ]
      }
    },
    {
      files: testFiles,
      env: {
        vitest: true
      },
      plugins: ['typescript', 'vitest'],
      jsPlugins: ['@trigen/oxlint-config/plugin'],
      rules: {
        'eslint/max-classes-per-file': 'off',
        'eslint/no-magic-numbers': 'off',
        'eslint/max-nested-callbacks': 'off',
        'typescript/no-unsafe-return': 'off',
        'typescript/no-unsafe-assignment': 'off',
        'typescript/no-unsafe-member-access': 'off',
        'typescript/no-unsafe-call': 'off',
        'typescript/no-unsafe-argument': 'off',
        'typescript/no-explicit-any': 'off',
        'typescript/await-thenable': 'off',
        'typescript/no-floating-promises': 'off',
        'unicorn/consistent-function-scoping': 'off',
        'trigen/import-order': 'off',
        'eslint/prefer-destructuring': 'off',
        'eslint/no-loop-func': 'off',
        'typescript/no-misused-promises': 'off',
        'eslint/no-use-before-define': 'off',
        'eslint/no-useless-assignment': 'off',
        'eslint/no-empty-function': 'off',
        'trigen/naming-convention': 'off',
        'trigen/func-style': 'off',
        'vitest/consistent-test-it': [
          'error',
          {
            fn: 'it',
            withinDescribe: 'it'
          }
        ],
        'vitest/no-disabled-tests': 'error',
        'vitest/no-focused-tests': 'error',
        'vitest/no-identical-title': 'error',
        'vitest/no-standalone-expect': 'error',
        'vitest/prefer-importing-vitest-globals': 'error',
        // The unit's address is a chain of describes, each with its own segment
        'vitest/require-top-level-describe': 'error',
        'vitest/valid-describe-callback': 'error',
        'vitest/valid-expect': 'error',
        'vitest/valid-title': [
          'error',
          {
            mustMatch: {
              it: '^should '
            },
            mustNotMatch: {
              describe: '/'
            }
          }
        ]

        // Unsupported by Oxlint
        // 'eslint/camelcase': 'off',
      }
    }
  ]
}
