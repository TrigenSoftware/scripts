/**
 * ESM override
 */

import bundlerConfig from './bundler.js'
import {
  commonjsFiles,
  not
} from './subconfigs/files.js'

export default {
  jsPlugins: ['@trigen/oxlint-config/plugin'],
  overrides: [
    ...bundlerConfig.overrides,
    {
      files: not(commonjsFiles),
      plugins: ['import'],
      rules: {
        'trigen/extensions': ['error', 'ignorePackages']
      }
    }
  ]
}
