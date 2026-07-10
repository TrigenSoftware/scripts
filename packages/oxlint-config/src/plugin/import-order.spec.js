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
  'trigen/import-order': [
    'error',
    {
      'groups': [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index'
      ],
      'pathGroups': [
        {
          pattern: '~/**',
          group: 'external',
          position: 'after'
        }
      ],
      'newlines-between': 'never',
      'typeImports': 'first'
    }
  ]
}

describe('oxlint-config', () => {
  describe('plugin', () => {
    describe('import-order', () => {
      let messages

      beforeAll(async () => {
        messages = await lint(rules, {
          'ordered.js': "import { join } from 'node:path'\nimport { a } from 'external-package'\nimport { b } from '~/app.js'\nimport { c } from '@/internal.js'\nimport { d } from '../parent.js'\nimport { e } from './sibling.js'\nimport { f } from './index.js'\n",
          'unordered-groups.js': "import { a } from 'external-package'\nimport { join } from 'node:path'\n",
          'type-after-value.ts': "import { a } from 'pkg-a'\nimport type { B } from 'pkg-b'\n",
          'blank-line.js': "import { join } from 'node:path'\n\nimport { a } from 'pkg'\n",
          'side-effect.js': "import { join } from 'node:path'\nimport './side-effect.js'\nimport { a } from 'pkg'\n",
          'path-group-before-external.js': "import { b } from '~/app.js'\nimport { a } from 'pkg'\n"
        })
      })

      it('should allow imports ordered by groups', () => {
        expect(messages['ordered.js']).toEqual([])
      })

      it('should report unordered import groups', () => {
        expect(messages['unordered-groups.js']).toEqual(['Expected builtin import to come before external import.'])
      })

      it('should report value import before type import', () => {
        expect(messages['type-after-value.ts']).toEqual(['Expected type import to come before value import.'])
      })

      it('should report blank line between imports when newlines are never', () => {
        expect(messages['blank-line.js']).toEqual(['Import declarations have invalid empty lines.'])
      })

      it('should ignore side effect imports', () => {
        expect(messages['side-effect.js']).toEqual([])
      })

      it('should report path group positioned after its group', () => {
        expect(messages['path-group-before-external.js']).toEqual(['Expected external import to come before external import.'])
      })

      it('should sort imports with autofix', async () => {
        const { files } = await lintWithFix(rules, {
          'fix-me.js': "import { a } from 'pkg'\nimport { join } from 'node:path'\n"
        })

        expect(files['fix-me.js']).toBe("import { join } from 'node:path'\nimport { a } from 'pkg'\n")
      })
    })
  })
})
