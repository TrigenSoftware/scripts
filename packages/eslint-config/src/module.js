/**
 * ESM override
 */

import bundlerConfig from './bundler.js'

export default [
  ...bundlerConfig,
  {
    ignores: bundlerConfig[0].ignores,
    rules: {
      'import/no-useless-path-segments': [
        'error',
        {
          noUselessIndex: false
        }
      ],
      'import/extensions': ['error', 'ignorePackages']
    }
  }
]
