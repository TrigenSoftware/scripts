/* eslint-disable camelcase */
import { describe, it, expect } from 'vitest'
import { setArgs } from 'argue-cli'
import { detectPackageManager, getRunArgs, readScripts } from './args.js'

describe('scripts', () => {
  describe('utils', () => {
    describe('detectPackageManager', () => {
      it('should return npm by default', () => {
        process.env.npm_config_user_agent = ''
        process.env.npm_execpath = ''
        expect(detectPackageManager()).toBe('npm')
      })

      it('should find package manager in npm_config_user_agent', () => {
        process.env.npm_config_user_agent = 'yarn etc'
        process.env.npm_execpath = ''
        expect(detectPackageManager()).toBe('yarn')
      })

      it('should find package manager in npm_execpath', () => {
        process.env.npm_config_user_agent = ''
        process.env.npm_execpath = 'node_modules/pnpm/cli.js'
        expect(detectPackageManager()).toBe('pnpm')
      })

      it('should detect pnpm v6', () => {
        process.env.npm_config_user_agent = 'pnpm/6.0.0'
        process.env.npm_execpath = ''
        expect(detectPackageManager()).toBe('pnpm')
      })

      it('should detect pnpm v7', () => {
        process.env.npm_config_user_agent = 'pnpm/7.0.0'
        process.env.npm_execpath = ''
        expect(detectPackageManager()).toBe('pnpm >=7')
      })
    })

    describe('getRunArgs', () => {
      it('should return run command', () => {
        expect(
          getRunArgs('npm', ['lint'])
        ).toEqual(['run', 'lint'])
        expect(
          getRunArgs('yarn', ['lint'])
        ).toEqual(['run', 'lint'])
      })

      it('should not add dashes for yarn', () => {
        expect(
          getRunArgs('yarn', ['lint', '--fix'])
        ).toEqual([
          'run',
          'lint',
          '--fix'
        ])
      })

      it('should add dashes', () => {
        expect(
          getRunArgs('pnpm', ['lint', '--fix'])
        ).toEqual([
          'run',
          'lint',
          '--',
          '--fix'
        ])
      })

      it('should not add dashes for pnpm >= 7', () => {
        expect(
          getRunArgs('pnpm >=7', ['lint', '--fix'])
        ).toEqual([
          'run',
          'lint',
          '--fix'
        ])
      })
    })

    describe('readScripts', () => {
      it('should read scripts without args', () => {
        setArgs('a', 'b', '[', 'c', ']')
        expect(
          readScripts()
        ).toEqual([
          ['a'],
          ['b'],
          ['c']
        ])
      })

      it('should read scripts with args', () => {
        setArgs('[', 'a', 'opt1', ']', '[', 'b', 'opt1', 'opt2', ']')
        expect(
          readScripts()
        ).toEqual([
          ['a', 'opt1'],
          [
            'b',
            'opt1',
            'opt2'
          ]
        ])
      })

      it('should read mixed scripts', () => {
        setArgs('c', '[', 'a', 'opt1', ']', '[', 'b', 'opt1', 'opt2', ']', 'd')
        expect(
          readScripts()
        ).toEqual([
          ['c'],
          ['a', 'opt1'],
          [
            'b',
            'opt1',
            'opt2'
          ],
          ['d']
        ])
      })
    })
  })
})
