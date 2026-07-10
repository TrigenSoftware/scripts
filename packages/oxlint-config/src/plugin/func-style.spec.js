import {
  describe,
  it,
  expect,
  beforeAll
} from 'vitest'
import { lint } from './ruleTester.mock.js'

const declarationMessage = 'Use a function declaration instead of assigning a function to a constant at the top level.'
const arrowMessage = 'Use an arrow function assigned to a constant instead of a nested function declaration.'

describe('oxlint-config', () => {
  describe('plugin', () => {
    describe('func-style', () => {
      let messages

      beforeAll(async () => {
        messages = await lint({
          'trigen/func-style': 'error'
        }, {
          'top-level-arrow.js': 'const SomeComponent = () => null\n',
          'top-level-function-expression.js': 'const someFn = function () {\n  return 1\n}\n',
          'nested-declaration.js': 'function outer() {\n  function inner() {\n    return 1\n  }\n\n  return inner\n}\n',
          'deep-bindings.js': 'function outer() {\n  function deeper() {\n    return function inner() {\n      return [this, arguments]\n    }\n  }\n\n  return deeper\n}\n',
          'top-level-declaration.js': 'function goodFn() {\n  return 1\n}\n',
          'conditional-functions.js': 'const conditionalFn = Math.random() > 0.5 ? () => 1 : () => 2\n',
          'nested-arrow.js': 'function outer() {\n  const inner = () => 1\n\n  return inner\n}\n',
          'nested-generator.js': 'function outer() {\n  function* inner() {\n    yield 1\n  }\n\n  return inner\n}\n',
          'nested-this.js': 'function outer() {\n  function inner() {\n    return this\n  }\n\n  return inner\n}\n',
          'nested-arguments.js': 'function outer() {\n  function inner() {\n    return arguments.length\n  }\n\n  return inner\n}\n',
          'typed-constant.ts': 'const typedFn: () => number = () => 1\n',
          'let-assignment.js': 'let reassignable = () => 1\n\nreassignable = () => 2\n',
          'wrapped-function.js': 'const memoized = wrap(() => 1)\n'
        })
      })

      it('should report top-level arrow function assigned to a constant', () => {
        expect(messages['top-level-arrow.js']).toEqual([declarationMessage])
      })

      it('should report top-level function expression assigned to a constant', () => {
        expect(messages['top-level-function-expression.js']).toEqual([declarationMessage])
      })

      it('should report nested function declaration', () => {
        expect(messages['nested-declaration.js']).toEqual([arrowMessage])
      })

      it('should report nested declaration when bindings are used only by deeper functions', () => {
        expect(messages['deep-bindings.js']).toEqual([arrowMessage])
      })

      it('should allow top-level function declaration', () => {
        expect(messages['top-level-declaration.js']).toEqual([])
      })

      it('should allow conditional function assignment', () => {
        expect(messages['conditional-functions.js']).toEqual([])
      })

      it('should allow arrow function assigned to a constant inside a function', () => {
        expect(messages['nested-arrow.js']).toEqual([])
      })

      it('should allow nested generator declaration', () => {
        expect(messages['nested-generator.js']).toEqual([])
      })

      it('should allow nested declaration using this', () => {
        expect(messages['nested-this.js']).toEqual([])
      })

      it('should allow nested declaration using arguments', () => {
        expect(messages['nested-arguments.js']).toEqual([])
      })

      it('should allow type-annotated constant with a function', () => {
        expect(messages['typed-constant.ts']).toEqual([])
      })

      it('should allow reassignable let with a function', () => {
        expect(messages['let-assignment.js']).toEqual([])
      })

      it('should allow functions passed to calls', () => {
        expect(messages['wrapped-function.js']).toEqual([])
      })
    })
  })
})
