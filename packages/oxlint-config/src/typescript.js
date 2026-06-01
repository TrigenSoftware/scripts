/**
 * TypeScript override
 */

import typescriptConfig from './subconfigs/typescript.js'
import typescriptStylisticConfig from './subconfigs/typescript.stylistic.js'

export default {
  extends: [
    typescriptConfig,
    typescriptStylisticConfig
  ]
}
