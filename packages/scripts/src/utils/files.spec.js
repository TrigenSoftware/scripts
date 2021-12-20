import { importDirFromFile } from './files.js'

describe('scripts', () => {
  describe('utils', () => {
    describe('importDirFromFile', () => {
      it('should return index file', () => {
        expect(importDirFromFile('scripts.js')).toBe('scripts/index.js')
      })
    })
  })
})
