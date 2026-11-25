/**
 * React Compiler override
 */

import { reactFiles } from './subconfigs/files.js'

export default {
  overrides: [
    {
      // The recommended set of eslint-plugin-react-hooks' compiler rules, which oxlint ships as its
      // own: what React Compiler cannot compile, or would compile wrong
      files: reactFiles,
      plugins: ['react'],
      jsPlugins: ['@trigen/oxlint-config/plugin'],
      rules: {
        'react/error-boundaries': 'error',
        // The compiler's own check of an effect's dependencies, in place of the rule of hooks': it
        // knows what the compiler keeps stable, so a function it memoizes is no false alarm
        'react/exhaustive-deps': 'off',
        'react/exhaustive-effect-dependencies': 'error',
        'react/globals': 'error',
        'react/immutability': 'error',
        'react/incompatible-library': 'warn',
        'react/preserve-manual-memoization': 'error',
        'react/purity': 'error',
        'react/refs': 'error',
        'react/set-state-in-effect': 'error',
        'react/set-state-in-render': 'error',
        'react/static-components': 'error',
        'react/unsupported-syntax': 'warn',
        'react/use-memo': 'error',
        'react/void-use-memo': 'error',
        // The compiler memoizes, so a hand-written memo is noise it has to preserve
        'trigen/no-manual-memo': 'error'
      }
    }
  ]
}
