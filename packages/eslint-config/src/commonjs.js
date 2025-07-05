/**
 * CommonJS override
 */

import { moduleFiles } from './subconfigs/files.js'
import moduleConfig from './module.js'

export default moduleConfig.map(({ ignores, ...config }) => ({
  files: moduleFiles,
  ...config
}))
