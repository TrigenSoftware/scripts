/**
 * Combine all basic configs
 */

import eslint from '@eslint/js'
import basicConfig from './subconfigs/basic.js'
import es6Config from './subconfigs/es6.js'
import jsdocConfig from './subconfigs/jsdoc.js'
import configsConfig from './subconfigs/configs.js'

export default [
  eslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          impliedStrict: true
        }
      }
    }
  },
  ...basicConfig,
  ...es6Config,
  ...jsdocConfig,
  ...configsConfig
]
