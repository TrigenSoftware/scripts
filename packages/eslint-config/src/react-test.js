/**
 * Test React override
 */

import testingLibraryPlugin from 'eslint-plugin-testing-library'
import { testFiles } from './subconfigs/files.js'

export default [
  {
    files: testFiles,
    ...testingLibraryPlugin.configs['flat/react']
  }
]
