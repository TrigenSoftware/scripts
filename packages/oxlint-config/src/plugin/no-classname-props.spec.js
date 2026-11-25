import {
  describe,
  it,
  expect,
  beforeAll
} from 'vitest'
import { lint } from './ruleTester.mock.js'

const rules = {
  'trigen/no-classname-props': 'error'
}

describe('oxlint-config', () => {
  describe('plugin', () => {
    describe('no-classname-props', () => {
      let messages

      beforeAll(async () => {
        messages = await lint(rules, {
          'part.tsx': "export const view = <Card titleClassName='title'/>\n",
          'root.tsx': "export const view = <Card className='card'/>\n"
        })
      })

      it('should report a class prop for a part', () => {
        expect(messages['part.tsx']).toEqual(['Make the part a component of its own with its own `className` instead of `titleClassName`.'])
      })

      it('should allow the root\'s className', () => {
        expect(messages['root.tsx']).toEqual([])
      })
    })
  })
})
