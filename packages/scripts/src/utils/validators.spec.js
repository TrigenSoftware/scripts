import { validateTasks, validateScript } from './validators.js'

describe('scripts', () => {
  describe('utils', () => {
    describe('validateTasks', () => {
      it('should validate tasks', () => {
        validateTasks('test', 'script-name')
        validateTasks('test', [() => true, 'script-name'])
      })

      it('should invalidate tasks', () => {
        expect(() => validateTasks('test', {})).toThrow(/Cant run/)
        expect(() => validateTasks('test', [123])).toThrow(/Cant run/)
      })
    })

    describe('validateScript', () => {
      it('should validate script', () => {
        validateScript('test', {
          run: ['test']
        })
      })

      it('should invalidate script', () => {
        expect(() => validateScript('', [123])).toThrow(/Script name is required/)
        expect(() => validateScript('test', null)).toThrow(/Unknown script/)
        expect(() => validateScript('test', [123])).toThrow(/Cant run/)
      })
    })
  })
})
