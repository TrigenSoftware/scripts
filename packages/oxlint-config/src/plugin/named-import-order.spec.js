import {
  describe,
  it,
  expect,
  beforeAll
} from 'vitest'
import {
  lint,
  lintWithFix
} from './ruleTester.mock.js'

const rules = {
  'trigen/named-import-order': [
    'error',
    {
      typeImports: 'first',
      patterns: [
        '^[A-Z][A-Z0-9_]*$',
        '^[A-Z][a-zA-Z0-9]*$',
        '^[a-z][a-zA-Z0-9]*$'
      ]
    }
  ]
}

describe('oxlint-config', () => {
  describe('plugin', () => {
    describe('named-import-order', () => {
      let messages

      beforeAll(async () => {
        messages = await lint(rules, {
          'sorted-multiline.ts': "import {\n  type TValue,\n  CONST,\n  Component,\n  value\n} from 'pkg'\n",
          'type-after-value.ts': "import {\n  value,\n  type TValue\n} from 'pkg'\n",
          'pattern-order.js': "import {\n  value,\n  CONST\n} from 'pkg'\n",
          'single-line.js': "import { a, b } from 'pkg'\n",
          'dollar-normalized.js': "import {\n  $store,\n  plain\n} from 'pkg'\n",
          'single-specifier.js': "import { a } from 'pkg'\n"
        })
      })

      it('should allow sorted multiline named imports', () => {
        expect(messages['sorted-multiline.ts']).toEqual([])
      })

      it('should report value import before type import', () => {
        expect(messages['type-after-value.ts']).toEqual(['Expected TValue to come before value because of import kind.'])
      })

      it('should report specifiers unordered by naming patterns', () => {
        expect(messages['pattern-order.js']).toEqual(['Expected CONST to come before value because of naming pattern.'])
      })

      it('should report single-line import with multiple specifiers', () => {
        expect(messages['single-line.js']).toEqual(['Expected named imports to be multiline.'])
      })

      it('should ignore dollar prefixes when matching patterns', () => {
        expect(messages['dollar-normalized.js']).toEqual([])
      })

      it('should allow single specifier on one line', () => {
        expect(messages['single-specifier.js']).toEqual([])
      })

      it('should sort specifiers and expand to multiline with autofix', async () => {
        const { files } = await lintWithFix(rules, {
          'fix-me.ts': "import { value, type TValue } from 'pkg'\n"
        })

        expect(files['fix-me.ts']).toBe("import {\n  type TValue,\n  value\n} from 'pkg'\n")
      })
    })
  })
})
