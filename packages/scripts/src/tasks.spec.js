import { jest } from '@jest/globals'
import { sh, cp, rm } from './tasks.js'

describe('scripts', () => {
  describe('tasks', () => {
    describe('sh', () => {
      it('should create task with arguments', async () => {
        const task = sh('ls', '-al')
        const spawn = jest.fn(() => 'output')

        expect(await task({
          argv: './'
        }, spawn)).toBe('')
        expect(await task({
          stdio: false
        }, spawn)).toBe('output')

        expect(spawn.mock.calls).toMatchObject([
          [
            'ls',
            ['-al', './'],
            {
              stdio: 'inherit'
            }
          ],
          [
            'ls',
            ['-al'],
            {
              stdio: 'pipe'
            }
          ]
        ])
      })

      it('should create task with env', async () => {
        const task = sh({
          SOME_ENV: 'test'
        }, 'jest')
        const spawn = jest.fn()

        await task({}, spawn)

        expect(spawn.mock.calls).toMatchObject([
          [
            'jest',
            [],
            {
              stdio: 'inherit',
              env: {
                SOME_ENV: 'test'
              }
            }
          ]
        ])
      })

      it('should create task with options', async () => {
        const task = sh('jest', {
          someOption: true
        })
        const spawn = jest.fn()

        await task({}, spawn)

        expect(spawn.mock.calls).toMatchObject([
          [
            'jest',
            [],
            {
              stdio: 'inherit',
              someOption: true
            }
          ]
        ])
      })

      it('should create task with env and options', async () => {
        const task = sh({
          SOME_ENV: 'test'
        }, 'jest', {
          someOption: true
        })
        const spawn = jest.fn()

        await task({}, spawn)

        expect(spawn.mock.calls).toMatchObject([
          [
            'jest',
            [],
            {
              stdio: 'inherit',
              someOption: true,
              env: {
                SOME_ENV: 'test'
              }
            }
          ]
        ])
      })
    })

    describe('cp', () => {
      it('should create task with arguments', async () => {
        const task = cp(['./src'], './dist', {
          someOption: true
        })
        const cpy = jest.fn()

        await task({}, cpy)
        await task({
          argv: ['./types']
        }, cpy)
        await task({
          argv: ['./types', './misc']
        }, cpy)
        await task({
          argv: [
            './types',
            './misc',
            '-d',
            './build'
          ]
        }, cpy)
        await task({
          argv: [
            './types',
            './misc',
            '--dest',
            './build'
          ]
        }, cpy)

        expect(cpy.mock.calls).toMatchObject([
          [
            ['./src'],
            './dist',
            {
              someOption: true
            }
          ],
          [
            ['./src', './types'],
            './dist',
            {
              someOption: true
            }
          ],
          [
            [
              './src',
              './types',
              './misc'
            ],
            './dist',
            {
              someOption: true
            }
          ],
          [
            [
              './src',
              './types',
              './misc'
            ],
            './build',
            {
              someOption: true
            }
          ],
          [
            [
              './src',
              './types',
              './misc'
            ],
            './build',
            {
              someOption: true
            }
          ]
        ])
      })
    })

    describe('rm', () => {
      it('should create task with arguments', async () => {
        const task = rm(['./dist', './build'], {
          someOption: true
        })
        const del = jest.fn()

        await task({}, del)
        await task({
          argv: ['./tmp']
        }, del)

        expect(del.mock.calls).toMatchObject([
          [
            ['./dist', './build'],
            {
              someOption: true
            }
          ],
          [
            [
              './dist',
              './build',
              './tmp'
            ],
            {
              someOption: true
            }
          ]
        ])
      })
    })
  })
})
