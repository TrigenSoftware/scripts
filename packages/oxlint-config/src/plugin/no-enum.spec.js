import {
  describe,
  it,
  expect,
  beforeAll
} from 'vitest'
import { lint } from './ruleTester.mock.js'

const rules = {
  'trigen/no-enum': 'error'
}

describe('oxlint-config', () => {
  describe('plugin', () => {
    describe('no-enum', () => {
      let messages

      beforeAll(async () => {
        messages = await lint(rules, {
          'enum.ts': 'export enum Size {\n  Small,\n  Large\n}\n',
          'const-enum.ts': 'export const enum Size {\n  Small,\n  Large\n}\n',
          'constants.ts': "export const SIZES = ['small', 'large'] as const\n"
        })
      })

      it('should report an enum', () => {
        expect(messages['enum.ts']).toEqual(['Do not use `enum`: it compiles to an object a bundler cannot drop. Use constants or a union of literals.'])
      })

      it('should leave a const enum to its own rule', () => {
        expect(messages['const-enum.ts']).toEqual([])
      })

      it('should allow constants', () => {
        expect(messages['constants.ts']).toEqual([])
      })
    })
  })
})
