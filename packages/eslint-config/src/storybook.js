/**
 * Storybook override
 */

import { storiesFiles } from './subconfigs/files.js'

export default [
  {
    files: storiesFiles,
    rules: {
      'max-classes-per-file': 'off',
      'no-magic-numbers': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      'max-nested-callbacks': 'off',
      'react/no-array-index-key': 'off',
      'react/jsx-no-bind': 'off',
      'import/no-default-export': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
]
