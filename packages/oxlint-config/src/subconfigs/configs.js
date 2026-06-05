/**
 * Configs config
 */

import { configFiles } from './files.js'

export default {
  overrides: [
    {
      files: configFiles,
      plugins: ['import'],
      rules: {
        'import/no-default-export': 'off',
        'import/no-anonymous-default-export': 'off'
      }
    }
  ]
}
