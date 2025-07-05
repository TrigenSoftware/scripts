/**
 * TypeScript type checked override
 */

import typescriptEslint from 'typescript-eslint'
import typescriptTypeCheckedConfig from './subconfigs/typescript-type-checked.js'

export default [...typescriptEslint.configs.recommendedTypeChecked, ...typescriptTypeCheckedConfig]
