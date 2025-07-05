/**
 * TypeScript override
 */

import typescriptEslint from 'typescript-eslint'
import typescriptConfig from './subconfigs/typescript.js'

export default [...typescriptEslint.configs.recommended, ...typescriptConfig]
