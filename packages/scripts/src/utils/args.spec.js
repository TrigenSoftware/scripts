import { parseArgs, stringifyArgs } from './args.js'

describe('scripts', () => {
  describe('utils', () => {
    describe('parseArgs', () => {
      it('should parse positional and key-value arguments', () => {
        expect(parseArgs([
          'pos1',
          '--enabled',
          'pos2',
          '--key',
          'value',
          '--camel-case'
        ], ['key'])).toEqual([
          ['pos1', 'pos2'],
          {
            enabled: true,
            key: 'value',
            camelCase: true
          }
        ])
      })
    })

    describe('stringifyArgs', () => {
      it('should stringify arguments', () => {
        expect(
          stringifyArgs(
            [
              'pos1',
              'pos2',
              undefined
            ],
            {
              enabled: true,
              key: 'value',
              camelCase: true,
              undef: undefined,
              files: ['a.js', 'b.js']
            }
          )
        ).toEqual([
          'pos1',
          'pos2',
          '--enabled',
          '--key',
          'value',
          '--camel-case',
          '--files',
          'a.js',
          '--files',
          'b.js'
        ])
      })
    })
  })
})
