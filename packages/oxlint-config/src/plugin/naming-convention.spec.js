import {
  describe,
  it,
  expect,
  beforeAll
} from 'vitest'
import { lint } from './ruleTester.mock.js'

const rules = {
  'trigen/naming-convention': [
    'error',
    {
      selector: 'default',
      format: [
        'camelCase',
        'PascalCase',
        'UPPER_CASE'
      ],
      leadingDollar: 'allow',
      trailingDollar: 'allow'
    },
    {
      selector: 'variable',
      format: [
        'camelCase',
        'UPPER_CASE',
        'PascalCase'
      ],
      leadingDollar: 'allow',
      trailingDollar: 'allow'
    },
    {
      selector: 'function',
      format: ['camelCase', 'PascalCase'],
      leadingDollar: 'allow',
      trailingDollar: 'allow'
    },
    {
      selector: 'parameter',
      format: ['camelCase', 'PascalCase'],
      leadingUnderscore: 'allow',
      leadingDollar: 'allow',
      trailingDollar: 'allow'
    },
    {
      selector: 'typeLike',
      format: ['PascalCase'],
      trailingDollar: 'allow'
    },
    {
      selector: 'interface',
      format: ['PascalCase'],
      trailingDollar: 'allow'
    },
    {
      selector: 'enumMember',
      format: ['PascalCase'],
      trailingDollar: 'allow'
    },
    {
      selector: 'classProperty',
      format: [
        'camelCase',
        'UPPER_CASE',
        'PascalCase'
      ],
      modifiers: ['static'],
      leadingDollar: 'allow',
      trailingDollar: 'allow'
    },
    {
      selector: ['objectLiteralProperty', 'objectLiteralMethod'],
      format: null,
      modifiers: ['requiresQuotes']
    }
  ]
}

describe('oxlint-config', () => {
  describe('plugin', () => {
    describe('naming-convention', () => {
      let messages

      beforeAll(async () => {
        messages = await lint(rules, {
          'valid-variables.js': 'const camelName = 1\nconst UPPER_NAME = 2\nconst PascalName = 3\nconst $store = 4\n',
          'invalid-variable.js': 'const snake_name = 1\n',
          'invalid-function.js': 'function snake_function() {\n  return 1\n}\n',
          'parameter-underscore.js': 'function handler(_unused, someParam) {\n  return someParam\n}\n',
          'invalid-parameter.js': 'function handler(bad_param) {\n  return bad_param\n}\n',
          'destructured-variables.js': 'const { someValue, ...restValues } = { someValue: 1 }\n',
          'valid-types.ts': 'interface SomeProps {\n  value: string\n}\n\ntype SomeType = string\n\nenum SomeEnum {\n  FirstValue\n}\n',
          'invalid-interface.ts': 'interface bad_props {\n  value: string\n}\n',
          'invalid-type-alias.ts': 'type bad_type = string\n',
          'invalid-enum-member.ts': 'enum SomeEnum {\n  BAD_MEMBER\n}\n',
          'quoted-property.js': "const headers = {\n  'Content-Type': 'text/html'\n}\n",
          'static-class-property.ts': 'class Some {\n  static SOME_CONST = 1\n}\n'
        })
      })

      it('should allow camelCase, UPPER_CASE, PascalCase and dollar-prefixed variables', () => {
        expect(messages['valid-variables.js']).toEqual([])
      })

      it('should report snake_case variable', () => {
        expect(messages['invalid-variable.js']).toEqual(['Name "snake_name" must match one of these formats: camelCase, UPPER_CASE, PascalCase.'])
      })

      it('should report snake_case function', () => {
        expect(messages['invalid-function.js']).toEqual(['Name "snake_function" must match one of these formats: camelCase, PascalCase.'])
      })

      it('should allow leading underscore in parameters', () => {
        expect(messages['parameter-underscore.js']).toEqual([])
      })

      it('should report snake_case parameter', () => {
        expect(messages['invalid-parameter.js']).toEqual(['Name "bad_param" must match one of these formats: camelCase, PascalCase.'])
      })

      it('should check destructured variable names', () => {
        expect(messages['destructured-variables.js']).toEqual([])
      })

      it('should allow PascalCase type-like names', () => {
        expect(messages['valid-types.ts']).toEqual([])
      })

      it('should report non-PascalCase interface', () => {
        expect(messages['invalid-interface.ts']).toEqual(['Name "bad_props" must match one of these formats: PascalCase.'])
      })

      it('should report non-PascalCase type alias', () => {
        expect(messages['invalid-type-alias.ts']).toEqual(['Name "bad_type" must match one of these formats: PascalCase.'])
      })

      it('should report non-PascalCase enum member', () => {
        expect(messages['invalid-enum-member.ts']).toEqual(['Name "BAD_MEMBER" must match one of these formats: PascalCase.'])
      })

      it('should allow quoted properties requiring quotes', () => {
        expect(messages['quoted-property.js']).toEqual([])
      })

      it('should allow UPPER_CASE static class property', () => {
        expect(messages['static-class-property.ts']).toEqual([])
      })
    })
  })
})
