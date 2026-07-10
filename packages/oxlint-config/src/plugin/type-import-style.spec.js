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
  'trigen/type-import-style': 'error'
}

describe('oxlint-config', () => {
  describe('plugin', () => {
    describe('type-import-style', () => {
      let messages

      beforeAll(async () => {
        messages = await lint(rules, {
          'all-type-specifiers.ts': "import { type A, type B } from './mod.js'\n",
          'separate-imports.ts': "import type { TValue } from './mod.js'\nimport { value } from './mod.js'\n",
          'plain-type-import.ts': "import type { A } from './mod.js'\n",
          'mixed-specifiers.ts': "import { type A, b } from './mod.js'\n",
          'different-sources.ts': "import type { A } from './a.js'\nimport { b } from './b.js'\n"
        })
      })

      it('should report named imports where all specifiers are type imports', () => {
        expect(messages['all-type-specifiers.ts']).toEqual(['Use import type when all named imports are type imports.'])
      })

      it('should report separate type and value imports from the same source', () => {
        expect(messages['separate-imports.ts']).toEqual(['Merge type and value imports from the same source.'])
      })

      it('should allow import type statement', () => {
        expect(messages['plain-type-import.ts']).toEqual([])
      })

      it('should allow mixed type and value specifiers', () => {
        expect(messages['mixed-specifiers.ts']).toEqual([])
      })

      it('should allow type and value imports from different sources', () => {
        expect(messages['different-sources.ts']).toEqual([])
      })

      it('should convert all-type named imports to import type with autofix', async () => {
        const { files } = await lintWithFix(rules, {
          'convert.ts': "import { type A, type B } from './mod.js'\n"
        })

        expect(files['convert.ts']).toBe("import type { A, B } from './mod.js'\n")
      })

      it('should merge type and value imports with autofix', async () => {
        const { files } = await lintWithFix(rules, {
          'merge.ts': "import type { TValue } from './mod.js'\nimport { value } from './mod.js'\n"
        })

        expect(files['merge.ts']).toBe("import {\n  type TValue,\n  value\n} from './mod.js'\n")
      })
    })
  })
})
