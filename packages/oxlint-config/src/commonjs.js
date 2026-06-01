/**
 * CommonJS override
 */

import moduleConfig from './module.js'
import { moduleFiles } from './subconfigs/files.js'

export default {
  overrides: moduleConfig.overrides.map(override => ({
    ...override,
    files: moduleFiles
  }))
}
