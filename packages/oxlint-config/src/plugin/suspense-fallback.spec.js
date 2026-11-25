import {
  describe,
  it,
  expect,
  beforeAll
} from 'vitest'
import { lint } from './ruleTester.mock.js'

const rules = {
  'trigen/suspense-fallback': 'error'
}
const message = 'Give `Suspense` the skeleton of what is coming as its `fallback`: an empty one leaves a hole that fills in late.'

describe('oxlint-config', () => {
  describe('plugin', () => {
    describe('suspense-fallback', () => {
      let messages

      beforeAll(async () => {
        messages = await lint(rules, {
          'missing.tsx': "import { Suspense } from 'react'\n\nexport const view = <Suspense><div/></Suspense>\n",
          'null.tsx': "import { Suspense } from 'react'\n\nexport const view = <Suspense fallback={null}><div/></Suspense>\n",
          'member.tsx': "import React from 'react'\n\nexport const view = <React.Suspense fallback={undefined}><div/></React.Suspense>\n",
          'shape.tsx': "import { Suspense } from 'react'\n\nexport const view = <Suspense fallback={<span/>}><div/></Suspense>\n",
          'spread.tsx': "import { Suspense } from 'react'\n\nexport const view = (props: object) => <Suspense {...props}><div/></Suspense>\n"
        })
      })

      it('should report a Suspense without a fallback', () => {
        expect(messages['missing.tsx']).toEqual([message])
      })

      it('should report a null fallback', () => {
        expect(messages['null.tsx']).toEqual([message])
      })

      it('should report an undefined fallback of React.Suspense', () => {
        expect(messages['member.tsx']).toEqual([message])
      })

      it('should allow a fallback that draws a shape', () => {
        expect(messages['shape.tsx']).toEqual([])
      })

      it('should leave a Suspense whose props come through a spread', () => {
        expect(messages['spread.tsx']).toEqual([])
      })
    })
  })
})
