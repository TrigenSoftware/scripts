import moduleConfig from '@trigen/oxlint-config/module'
import rootConfig from '../../oxlint.config.ts'

export default {
  ...rootConfig,
  extends: [
    rootConfig,
    moduleConfig
  ]
}
