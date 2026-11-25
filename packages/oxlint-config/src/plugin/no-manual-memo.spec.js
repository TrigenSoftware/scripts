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
  'trigen/no-manual-memo': 'error'
}

describe('oxlint-config', () => {
  describe('plugin', () => {
    describe('no-manual-memo', () => {
      let messages

      beforeAll(async () => {
        messages = await lint(rules, {
          'named.tsx': "import { memo, useCallback, useMemo } from 'react'\n",
          'aliased.tsx': "import { useMemo as useValue } from 'react'\n",
          'namespace.tsx': "import * as React from 'react'\n\nexport const value = React.useMemo(() => 1, [])\n",
          'default.tsx': "import React from 'react'\n\nexport const Card = React.memo(() => null)\n",
          'other-hooks.tsx': "import React, { useState } from 'react'\n\nexport const state = React.useState\nexport const hook = useState\n",
          'other-source.tsx': "import { memo, useMemo } from './memo.js'\n",
          'type-only.tsx': "import type { memo } from 'react'\n"
        })
      })

      it('should report each memoizing import from react', () => {
        expect(messages['named.tsx']).toEqual([
          'Do not use `memo`: React Compiler memoizes components and hooks.',
          'Do not use `useCallback`: React Compiler memoizes components and hooks.',
          'Do not use `useMemo`: React Compiler memoizes components and hooks.'
        ])
      })

      it('should report an aliased import by its imported name', () => {
        expect(messages['aliased.tsx']).toEqual(['Do not use `useMemo`: React Compiler memoizes components and hooks.'])
      })

      it('should report a memoizing member of a namespace import', () => {
        expect(messages['namespace.tsx']).toEqual(['Do not use `useMemo`: React Compiler memoizes components and hooks.'])
      })

      it('should report a memoizing member of a default import', () => {
        expect(messages['default.tsx']).toEqual(['Do not use `memo`: React Compiler memoizes components and hooks.'])
      })

      it('should allow other react exports', () => {
        expect(messages['other-hooks.tsx']).toEqual([])
      })

      it('should allow the names from another source', () => {
        expect(messages['other-source.tsx']).toEqual([])
      })

      it('should allow a type import', () => {
        expect(messages['type-only.tsx']).toEqual([])
      })

      describe('autofix', () => {
        let files
        let fixMessages

        beforeAll(async () => {
          ({
            files,
            messages: fixMessages
          } = await lintWithFix(rules, {
            'callback.tsx': "import { useCallback, useState } from 'react'\n\nexport function useCount() {\n  const [count, setCount] = useState(0)\n  const increment = useCallback(() => setCount(count + 1), [count])\n\n  return increment\n}\n",
            'value.tsx': "import { useMemo } from 'react'\n\nexport function useTotal(a: number, b: number) {\n  const total = useMemo(() => a + b, [a, b])\n\n  return total * 2\n}\n",
            'operand.tsx': "import { useMemo } from 'react'\n\nexport function useTotal(a: number, b: number) {\n  return 2 * useMemo(() => a + b, [a, b])\n}\n",
            'object.tsx': "import { useMemo } from 'react'\n\nexport function useStyle(color: string) {\n  return useMemo(() => ({ color }), [color])\n}\n",
            'typed.tsx': "import { useMemo } from 'react'\n\nexport function useItems(list: string[]) {\n  const items = useMemo<string[]>(() => list.filter(Boolean), [list])\n\n  return items\n}\n",
            'component.tsx': "import { memo } from 'react'\n\nfunction Card() {\n  return null\n}\n\nexport default memo(Card)\n",
            'multiline.tsx': "import {\n  useCallback,\n  useMemo,\n  useState\n} from 'react'\n\nexport function useBoth() {\n  const [value] = useState(1)\n  const doubled = useMemo(() => value * 2, [value])\n  const read = useCallback(() => doubled, [doubled])\n\n  return read\n}\n",
            'default-and-named.tsx': "import React, { useCallback } from 'react'\n\nexport function useRead(value: number) {\n  React.useState(value)\n\n  return useCallback(() => value, [value])\n}\n",
            'namespace.tsx': "import * as React from 'react'\n\nexport function useRead(value: number) {\n  return React.useCallback(() => value, [value])\n}\n",
            'block.tsx': "import { useMemo } from 'react'\n\nexport function useTotal(a: number) {\n  return useMemo(() => {\n    return a * 2\n  }, [a])\n}\n",
            'compare.tsx': "import { memo } from 'react'\n\nfunction Card() {\n  return null\n}\n\nexport default memo(Card, () => true)\n"
          }))
        })

        it('should unwrap a callback and drop its import', () => {
          expect(files['callback.tsx']).toBe("import { useState } from 'react'\n\nexport function useCount() {\n  const [count, setCount] = useState(0)\n  const increment = () => setCount(count + 1)\n\n  return increment\n}\n")
        })

        it('should unwrap a value and drop the import with its line', () => {
          expect(files['value.tsx']).toBe('\nexport function useTotal(a: number, b: number) {\n  const total = a + b\n\n  return total * 2\n}\n')
        })

        it('should parenthesize a value that stands in an operand', () => {
          expect(files['operand.tsx']).toBe('\nexport function useTotal(a: number, b: number) {\n  return 2 * (a + b)\n}\n')
        })

        it('should keep an object value as an expression', () => {
          expect(files['object.tsx']).toBe('\nexport function useStyle(color: string) {\n  return { color }\n}\n')
        })

        it('should move the type of the hook to its variable', () => {
          expect(files['typed.tsx']).toBe('\nexport function useItems(list: string[]) {\n  const items: string[] = list.filter(Boolean)\n\n  return items\n}\n')
        })

        it('should unwrap a memoized component', () => {
          expect(files['component.tsx']).toBe('\nfunction Card() {\n  return null\n}\n\nexport default Card\n')
        })

        it('should unwrap the names of a multiline import', () => {
          expect(files['multiline.tsx']).toBe("import {\n  useState\n} from 'react'\n\nexport function useBoth() {\n  const [value] = useState(1)\n  const doubled = value * 2\n  const read = () => doubled\n\n  return read\n}\n")
        })

        it('should keep the default import as its named one goes', () => {
          expect(files['default-and-named.tsx']).toBe("import React from 'react'\n\nexport function useRead(value: number) {\n  React.useState(value)\n\n  return () => value\n}\n")
        })

        it('should unwrap a member of a namespace import', () => {
          expect(files['namespace.tsx']).toBe("import * as React from 'react'\n\nexport function useRead(value: number) {\n  return () => value\n}\n")
        })

        it('should leave a factory with a block body', () => {
          expect(fixMessages['block.tsx']).toEqual(['Do not use `useMemo`: React Compiler memoizes components and hooks.'])
        })

        it('should leave a component with a comparison', () => {
          expect(fixMessages['compare.tsx']).toEqual(['Do not use `memo`: React Compiler memoizes components and hooks.'])
        })
      })
    })
  })
})
