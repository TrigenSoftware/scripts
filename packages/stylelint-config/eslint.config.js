import moduleConfig from '@trigen/eslint-config/module'
import rootConfig from '../../eslint.config.js'

export default [
  ...rootConfig,
  ...moduleConfig,
  {
    rules: {
      'no-magic-numbers': 'off',
      'import/no-default-export': 'off',
      'import/no-anonymous-default-export': 'off'
    }
  }
]
