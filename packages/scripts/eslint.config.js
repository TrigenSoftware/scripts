import moduleConfig from '@trigen/eslint-config/module'
import testConfig from '@trigen/eslint-config/test'
import rootConfig from '../../eslint.config.js'

export default [
  ...rootConfig,
  ...testConfig,
  ...moduleConfig
]
