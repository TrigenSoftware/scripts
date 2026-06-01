import moduleConfig from '@trigen/oxlint-config/module'
import testConfig from '@trigen/oxlint-config/test'
import rootConfig from '../../oxlint.config.ts'

export default {
  ...rootConfig,
  extends: [
    rootConfig,
    moduleConfig,
    testConfig
  ]
}
