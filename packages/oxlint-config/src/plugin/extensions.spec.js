import {
  describe,
  it,
  expect,
  beforeAll
} from 'vitest'
import { lint } from './ruleTester.mock.js'

describe('oxlint-config', () => {
  describe('plugin', () => {
    describe('extensions', () => {
      describe('ignorePackages', () => {
        let messages

        beforeAll(async () => {
          messages = await lint({
            'trigen/extensions': ['error', 'ignorePackages']
          }, {
            'relative-with-extension.js': "import { a } from './module.js'\n",
            'relative-without-extension.js': "import { a } from './module'\n",
            'package-import.js': "import { join } from 'node:path'\n",
            'export-from-without-extension.js': "export { a } from './module'\n",
            'export-all-without-extension.js': "export * from './module'\n",
            'query-suffix.js': "import styles from './styles.css?raw'\n"
          })
        })

        it('should allow relative import with extension', () => {
          expect(messages['relative-with-extension.js']).toEqual([])
        })

        it('should report relative import without extension', () => {
          expect(messages['relative-without-extension.js']).toEqual(['Missing file extension for "./module".'])
        })

        it('should ignore package imports', () => {
          expect(messages['package-import.js']).toEqual([])
        })

        it('should report named re-export without extension', () => {
          expect(messages['export-from-without-extension.js']).toEqual(['Missing file extension for "./module".'])
        })

        it('should report export all without extension', () => {
          expect(messages['export-all-without-extension.js']).toEqual(['Missing file extension for "./module".'])
        })

        it('should ignore query suffix when extension is present', () => {
          expect(messages['query-suffix.js']).toEqual([])
        })
      })

      describe('always', () => {
        let messages

        beforeAll(async () => {
          messages = await lint({
            'trigen/extensions': 'error'
          }, {
            'package-import.js': "import { useState } from 'react'\n"
          })
        })

        it('should report package import without extension', () => {
          expect(messages['package-import.js']).toEqual(['Missing file extension for "react".'])
        })
      })
    })
  })
})
