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
  'trigen/named-export-order': [
    'error',
    {
      typeExports: 'first',
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
    describe('named-export-order', () => {
      let messages

      beforeAll(async () => {
        messages = await lint(rules, {
          'sorted-multiline.ts': "export {\n  type TValue,\n  CONST,\n  value\n} from './mod.js'\n",
          'type-after-value.ts': "export {\n  value,\n  type TValue\n} from './mod.js'\n",
          'pattern-order.js': "export {\n  value,\n  CONST\n} from './mod.js'\n",
          'single-line.js': "export { a, b } from './mod.js'\n",
          'local-exports.js': 'const first = 1\nconst second = 2\n\nexport {\n  first,\n  second\n}\n',
          'single-specifier.js': "export { a } from './mod.js'\n"
        })
      })

      it('should allow sorted multiline named exports', () => {
        expect(messages['sorted-multiline.ts']).toEqual([])
      })

      it('should report value export before type export', () => {
        expect(messages['type-after-value.ts']).toEqual(['Expected TValue to come before value because of export kind.'])
      })

      it('should report specifiers unordered by naming patterns', () => {
        expect(messages['pattern-order.js']).toEqual(['Expected CONST to come before value because of naming pattern.'])
      })

      it('should report single-line export with multiple specifiers', () => {
        expect(messages['single-line.js']).toEqual(['Expected named exports to be multiline.'])
      })

      it('should allow sorted local named exports', () => {
        expect(messages['local-exports.js']).toEqual([])
      })

      it('should allow single specifier on one line', () => {
        expect(messages['single-specifier.js']).toEqual([])
      })

      it('should sort specifiers and expand to multiline with autofix', async () => {
        const { files } = await lintWithFix(rules, {
          'fix-me.ts': "export { value, type TValue } from './mod.js'\n"
        })

        expect(files['fix-me.ts']).toBe("export {\n  type TValue,\n  value\n} from './mod.js'\n")
      })
    })
  })
})
