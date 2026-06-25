/**
 * Test override
 */

import { testFiles } from './subconfigs/files.js'

export default {
  overrides: [
    {
      files: testFiles,
      env: {
        vitest: true
      },
      plugins: ['typescript'],
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
        'trigen/import-order': 'off',
        'eslint/prefer-destructuring': 'off',
        'eslint/no-loop-func': 'off',
        'typescript/no-misused-promises': 'off',
        'eslint/no-use-before-define': 'off',
        'eslint/no-useless-assignment': 'off',
        'eslint/no-empty-function': 'off',
        'trigen/naming-convention': 'off'

        // Unsupported by Oxlint
        // 'eslint/camelcase': 'off',
      }
    }
  ]
}
