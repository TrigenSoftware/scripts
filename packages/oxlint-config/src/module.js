/**
 * ESM override
 */

import bundlerConfig from './bundler.js'
import {
  commonjsFiles,
  not
} from './subconfigs/files.js'

export default {
  overrides: [
    ...bundlerConfig.overrides,
    {
      files: not(commonjsFiles),
      plugins: ['import'],
      rules: {
        'import/extensions': ['error', 'ignorePackages']
      }
    }
  ]
}
