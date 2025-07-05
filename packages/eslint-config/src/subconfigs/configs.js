/**
 * Configs config
 */

import { configFiles } from './files.js'

export default [
  {
    files: configFiles,
    rules: {
      'import/no-default-export': 'off',
      'import/no-anonymous-default-export': 'off'
    }
  }
]
