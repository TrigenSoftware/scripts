import {
  describe,
  it,
  expect,
  beforeAll
} from 'vitest'
import { lint } from './ruleTester.mock.js'

const rules = {
  'trigen/time-datetime': 'error'
}

describe('oxlint-config', () => {
  describe('plugin', () => {
    describe('time-datetime', () => {
      let messages

      beforeAll(async () => {
        messages = await lint(rules, {
          'missing.tsx': 'export const view = <time>today</time>\n',
          'given.tsx': "export const view = <time dateTime='2026-11-25'>today</time>\n",
          'spread.tsx': 'export const view = (props: object) => <time {...props}>today</time>\n',
          'component.tsx': 'export const view = <Time>today</Time>\n'
        })
      })

      it('should report a time without dateTime', () => {
        expect(messages['missing.tsx']).toEqual(['Give `<time>` its `dateTime`, the value machines read.'])
      })

      it('should allow a time with dateTime', () => {
        expect(messages['given.tsx']).toEqual([])
      })

      it('should leave a time whose props come through a spread', () => {
        expect(messages['spread.tsx']).toEqual([])
      })

      it('should leave a component named Time', () => {
        expect(messages['component.tsx']).toEqual([])
      })
    })
  })
})
