import {
  describe,
  it,
  expect,
  beforeAll
} from 'vitest'
import { lint } from './ruleTester.mock.js'

const rules = {
  'trigen/member-ordering': [
    'error',
    {
      default: {
        order: 'as-written',
        memberTypes: [
          'public-static-method',
          'protected-static-method',
          'private-static-method',
          'public-static-field',
          'protected-static-field',
          'private-static-field',
          'public-decorated-field',
          'protected-decorated-field',
          'private-decorated-field',
          'public-instance-field',
          'protected-instance-field',
          'private-instance-field',
          'public-abstract-field',
          'protected-abstract-field',
          'field',
          'signature',
          'call-signature',
          'public-constructor',
          'protected-constructor',
          'private-constructor',
          'constructor',
          'instance-method',
          'method'
        ]
      }
    }
  ]
}

describe('oxlint-config', () => {
  describe('plugin', () => {
    describe('member-ordering', () => {
      let messages

      beforeAll(async () => {
        messages = await lint(rules, {
          'interface-sorted.ts': 'interface Props {\n  name?: string\n  value: string | null\n  disabled?: boolean\n  onChange?(value: string): void\n  onReset?(): void\n}\n',
          'interface-method-before-field.ts': 'interface Props {\n  onChange?(value: string): void\n  disabled?: boolean\n}\n',
          'interface-index-signature-first.ts': 'interface Props {\n  [key: string]: unknown\n  id: string\n}\n',
          'interface-callback-fields.ts': 'interface Props {\n  id: string\n  onSelect?: (id: string) => void\n  [key: string]: unknown\n}\n',
          'interface-construct-signature.ts': 'interface Newable {\n  kind: string\n  new (value: string): object\n  parse(input: string): object\n}\n',
          'type-literal-method-before-field.ts': 'type Handlers = {\n  handle(event: string): void\n  passive: boolean\n}\n',
          'class-sorted.ts': "class Editor {\n  static create() {\n    return new Editor()\n  }\n\n  name = 'a'\n\n  constructor() {\n    this.name = 'b'\n  }\n\n  focus() {\n    return this.name\n  }\n}\n",
          'class-method-before-field.ts': "class Editor {\n  focus() {\n    return 1\n  }\n\n  name = 'a'\n}\n"
        })
      })

      it('should allow interface fields before methods', () => {
        expect(messages['interface-sorted.ts']).toEqual([])
      })

      it('should report interface method before field', () => {
        expect(messages['interface-method-before-field.ts']).toEqual(['Member "disabled" should be declared before "onChange".'])
      })

      it('should report interface index signature before fields', () => {
        expect(messages['interface-index-signature-first.ts']).toEqual(['Member "id" should be declared before "TSIndexSignature".'])
      })

      it('should treat callback properties as fields', () => {
        expect(messages['interface-callback-fields.ts']).toEqual([])
      })

      it('should allow construct signature between fields and methods', () => {
        expect(messages['interface-construct-signature.ts']).toEqual([])
      })

      it('should report type literal method before field', () => {
        expect(messages['type-literal-method-before-field.ts']).toEqual(['Member "passive" should be declared before "handle".'])
      })

      it('should allow ordered class members', () => {
        expect(messages['class-sorted.ts']).toEqual([])
      })

      it('should report class method before field', () => {
        expect(messages['class-method-before-field.ts']).toEqual(['Member "name" should be declared before "focus".'])
      })
    })
  })
})
