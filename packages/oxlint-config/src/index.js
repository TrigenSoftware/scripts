/**
 * Combine all basic configs
 */

import basicConfig from './subconfigs/basic.js'
import importConfig from './subconfigs/import.js'
import baseStylisticConfig from './subconfigs/base.stylistic.js'
import jsdocConfig from './subconfigs/jsdoc.js'
import configsConfig from './subconfigs/configs.js'

export default {
  extends: [
    basicConfig,
    importConfig,
    baseStylisticConfig,
    jsdocConfig,
    configsConfig
  ]
}
