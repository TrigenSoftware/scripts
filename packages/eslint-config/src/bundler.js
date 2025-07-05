/**
 * Bundler override
 */

import { commonjsFiles } from './subconfigs/files.js'

export default [
  {
    ignores: commonjsFiles,
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
