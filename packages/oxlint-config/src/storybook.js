/**
 * Storybook override
 */

import { storiesFiles } from './subconfigs/files.js'

export default {
  overrides: [
    {
      files: storiesFiles,
      plugins: [
        'import',
        'react',
        'typescript'
      ],
      jsPlugins: ['@trigen/oxlint-config/plugin'],
      rules: {
        'eslint/max-classes-per-file': 'off',
        'eslint/no-magic-numbers': 'off',
        'eslint/max-nested-callbacks': 'off',
        'react/no-array-index-key': 'off',
        'import/no-default-export': 'off',
        'typescript/no-unsafe-return': 'off',
        'typescript/no-unsafe-assignment': 'off',
        'typescript/no-unsafe-member-access': 'off',
        'typescript/no-unsafe-call': 'off',
        'typescript/no-unsafe-argument': 'off',
        'typescript/no-explicit-any': 'off',
        'trigen/func-style': 'off'
      }
    }
  ]
}
