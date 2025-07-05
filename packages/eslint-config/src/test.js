/**
 * Test override
 */

import jestPlugin from 'eslint-plugin-jest'
import { testFiles } from './subconfigs/files.js'

export default [
  {
    files: testFiles,
    plugins: {
      jest: jestPlugin
    },
    languageOptions: {
      globals: jestPlugin.environments.globals.globals
    },
    rules: {
      'max-classes-per-file': 'off',
      'no-magic-numbers': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      'import/order': 'off',
      'max-nested-callbacks': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      'prefer-destructuring': 'off',
      'no-loop-func': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      'camelcase': 'off'
    }
  }
]
