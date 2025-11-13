/**
 * TypeScript type checked override
 */

import typescriptEslint from 'typescript-eslint'
import typescriptTypeCheckedConfig from './subconfigs/typescript-type-checked.js'
import { tsFiles } from './subconfigs/files.js'

export default [
  ...typescriptEslint.configs.recommendedTypeChecked.map(config => ({
    ...config,
    files: tsFiles
  })),
  ...typescriptTypeCheckedConfig
]
