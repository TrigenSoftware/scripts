import { globalIgnores } from 'eslint/config'
import commonjsConfig from '@trigen/eslint-config/commonjs'
import rootConfig from '../../eslint.config.js'

export default [
  globalIgnores(['**/*.d.ts']),
  ...rootConfig,
  ...commonjsConfig,
  {
    rules: {
      'no-magic-numbers': 'off',
      'import/no-default-export': 'off',
      'import/no-anonymous-default-export': 'off'
    }
  }
]
