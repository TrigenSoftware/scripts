/**
 * TypeScript override
 */

import typescriptEslint from 'typescript-eslint'
import typescriptConfig from './subconfigs/typescript.js'
import { tsFiles } from './subconfigs/files.js'

export default [
  ...typescriptEslint.configs.recommended.map(config => ({
    ...config,
    files: tsFiles
  })),
  ...typescriptConfig
]
