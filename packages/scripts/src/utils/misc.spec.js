import { toArray, isObject } from './misc.js'

describe('scripts', () => {
  describe('utils', () => {
    describe('toArray', () => {
      it('should return array from non-array input', () => {
        expect(toArray(1)).toEqual([1])
      })

      it('should return same array from array input', () => {
        const array = [1, 2]

        expect(toArray(array)).toBe(array)
      })
    })

    describe('isObject', () => {
      it('should return true for objects', () => {
        expect(isObject({})).toBe(true)
      })

      it('should return false for non-objects', () => {
        expect(isObject(null)).toBe(false)
        expect(isObject(1)).toBe(false)
      })
    })
  })
})
