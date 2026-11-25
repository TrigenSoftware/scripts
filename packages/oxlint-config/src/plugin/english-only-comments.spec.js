import {
  describe,
  it,
  expect,
  beforeAll
} from 'vitest'
import { lint } from './ruleTester.mock.js'

const rules = {
  'trigen/english-only-comments': 'error'
}

describe('oxlint-config', () => {
  describe('plugin', () => {
    describe('english-only-comments', () => {
      let messages

      beforeAll(async () => {
        messages = await lint(rules, {
          'cyrillic.ts': '// Сначала загрузка `fetchPlants`\nexport const value = 1\n',
          'quoted.ts': '// English, Română, 日本語, as the design lists them\nexport const value = 1\n',
          'japanese.ts': '/* 日本語の説明 */\nexport const value = 1\n',
          'english.ts': '// Loads first, naïvely: a café\'s menu → 3 items ✓\nexport const value = 1\n',
          'string.ts': "export const value = 'Привет'\n"
        })
      })

      it('should report a comment in Cyrillic', () => {
        expect(messages['cyrillic.ts']).toEqual(['Write comments in English.'])
      })

      it('should report a comment in another script', () => {
        expect(messages['japanese.ts']).toEqual(['Write comments in English.'])
      })

      it('should allow an English comment quoting words of another script', () => {
        expect(messages['quoted.ts']).toEqual([])
      })

      it('should allow Latin letters with diacritics and symbols', () => {
        expect(messages['english.ts']).toEqual([])
      })

      it('should leave strings alone', () => {
        expect(messages['string.ts']).toEqual([])
      })
    })
  })
})
