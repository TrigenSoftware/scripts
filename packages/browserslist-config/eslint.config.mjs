import moduleConfig from '@trigen/eslint-config/module'
import rootConfig from '../../eslint.config.js'

export default [
  ...rootConfig,
  ...moduleConfig,
  {
    rules: {
      'import/no-default-export': 'off'
    }
  }
]
