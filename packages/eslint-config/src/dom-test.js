/**
 * Test DOM override
 */

import jestDomPlugin from 'eslint-plugin-jest-dom'
import { testFiles } from './subconfigs/files.js'

export default [
  {
    files: testFiles,
    ...jestDomPlugin.configs['flat/recommended']
  }
]
