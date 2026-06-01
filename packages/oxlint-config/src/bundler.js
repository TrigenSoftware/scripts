/**
 * Bundler override
 */

import {
  commonjsFiles,
  not
} from './subconfigs/files.js'

export default {
  overrides: [
    {
      files: not(commonjsFiles),
      plugins: ['import'],
      rules: {
        'import/unambiguous': 'error',
        'import/no-commonjs': [
          'error',
          {
            allowRequire: false,
            allowPrimitiveModules: false
          }
        ]
      }
    }
  ]
}
