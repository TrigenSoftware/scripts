/**
 * TypeScript type checked override
 */

import typescriptTypeCheckedConfig from './subconfigs/typescript-type-checked.js'
import typescriptStylisticConfig from './subconfigs/typescript.stylistic.js'

export default {
  extends: [
    typescriptTypeCheckedConfig,
    typescriptStylisticConfig
  ]
}
