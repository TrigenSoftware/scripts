import {
  describe,
  it,
  expect,
  beforeAll
} from 'vitest'
import { lint } from './ruleTester.mock.js'

const rules = {
  'trigen/props-order': 'error'
}

describe('oxlint-config', () => {
  describe('plugin', () => {
    describe('props-order', () => {
      let messages

      beforeAll(async () => {
        messages = await lint(rules, {
          'props-ordered.tsx': 'export function Card({ ref, className, title, children, ...props }) {\n  return title\n}\n',
          'props-ref-late.tsx': 'export function Card({ className, ref }) {\n  return className\n}\n',
          'props-class-late.tsx': 'export const Card = ({ title, className }) => title\n',
          'props-children-early.tsx': 'export function Card({ children, title, ...props }) {\n  return title\n}\n',
          'props-default.tsx': 'export function Card({ title, className } = {}) {\n  return title\n}\n',
          'props-not-component.tsx': 'export function useCard({ title, className }) {\n  return title\n}\n',
          'jsx-ordered.tsx': 'export const view = <li key=\'1\' ref={ref} className=\'item\' id=\'x\'/>\n',
          'jsx-key-late.tsx': 'export const view = <li className=\'item\' key=\'1\'/>\n',
          'jsx-class-late.tsx': 'export const view = <div id=\'x\' className=\'card\'/>\n',
          'jsx-ref-late.tsx': 'export const view = <div id=\'x\' ref={ref}/>\n',
          'jsx-ref-owned.tsx': 'export const view = <div className=\'card\' {...props} ref={ref} aria-busy/>\n',
          'jsx-ref-owned-late.tsx': 'export const view = <div {...props} aria-busy ref={ref}/>\n'
        })
      })

      it('should allow ref and className first and children last among a component\'s props', () => {
        expect(messages['props-ordered.tsx']).toEqual([])
      })

      it('should report a ref that does not open a component\'s props', () => {
        expect(messages['props-ref-late.tsx']).toEqual(['`ref` opens a component\'s props.'])
      })

      it('should report a className after another prop of an arrow component', () => {
        expect(messages['props-class-late.tsx']).toEqual(['`className` comes first among a component\'s props, after `ref`.'])
      })

      it('should report children before another prop', () => {
        expect(messages['props-children-early.tsx']).toEqual(['`children` closes a component\'s props, right before the rest.'])
      })

      it('should read props with a default', () => {
        expect(messages['props-default.tsx']).toEqual(['`className` comes first among a component\'s props, after `ref`.'])
      })

      it('should leave a function that is no component alone', () => {
        expect(messages['props-not-component.tsx']).toEqual([])
      })

      it('should allow key, ref and className first among an element\'s attributes', () => {
        expect(messages['jsx-ordered.tsx']).toEqual([])
      })

      it('should report a key that does not open an element\'s attributes', () => {
        expect(messages['jsx-key-late.tsx']).toEqual(['`key` opens an element\'s attributes.'])
      })

      it('should report a className after another attribute', () => {
        expect(messages['jsx-class-late.tsx']).toEqual(['`className` comes first among an element\'s attributes, after `key` and `ref`.'])
      })

      it('should report a ref after another attribute', () => {
        expect(messages['jsx-ref-late.tsx']).toEqual(['`ref` opens an element\'s attributes after `key`, or the attributes a component owns right after a spread.'])
      })

      it('should allow a ref the component owns right after the spread', () => {
        expect(messages['jsx-ref-owned.tsx']).toEqual([])
      })

      it('should report an owned ref that does not lead the attributes after the spread', () => {
        expect(messages['jsx-ref-owned-late.tsx']).toEqual(['`ref` opens an element\'s attributes after `key`, or the attributes a component owns right after a spread.'])
      })
    })
  })
})
