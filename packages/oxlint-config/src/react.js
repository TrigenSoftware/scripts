/**
 * React override
 */

import reactConfig from './subconfigs/react.js'
import reactStylisticConfig from './subconfigs/react.stylistic.js'

export default {
  extends: [
    reactConfig,
    reactStylisticConfig
  ]
}
