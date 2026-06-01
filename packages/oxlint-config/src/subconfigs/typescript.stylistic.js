/**
 * TypeScript stylistic config
 */

import { tsFiles } from './files.js'

export default {
  overrides: [
    {
      files: tsFiles,
      jsPlugins: [
        {
          name: 'stylistic-js',
          specifier: '@stylistic/eslint-plugin'
        }
      ],
      rules: {
        'stylistic-js/member-delimiter-style': [
          'error',
          {
            multiline: {
              delimiter: 'none',
              requireLast: true
            },
            singleline: {
              delimiter: 'comma',
              requireLast: false
            }
          }
        ],
        'stylistic-js/type-annotation-spacing': 'error',
        'stylistic-js/type-generic-spacing': 'error',
        'stylistic-js/type-named-tuple-spacing': 'error'
      }
    }
  ]
}
