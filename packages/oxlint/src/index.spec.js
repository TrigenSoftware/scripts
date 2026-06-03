import { describe, it, expect } from 'vitest'
import { defineConfig } from './index.js'

describe('oxlint', () => {
  describe('defineConfig', () => {
    it('should merge ignore patterns from extended configs', () => {
      const config = defineConfig({
        ignorePatterns: ['dist'],
        extends: [
          {
            ignorePatterns: ['coverage']
          },
          {
            ignorePatterns: ['package']
          }
        ]
      })

      expect(config.ignorePatterns).toEqual([
        'dist',
        'coverage',
        'package'
      ])
    })

    it('should merge env from extended configs', () => {
      const config = defineConfig({
        env: {
          browser: true
        },
        extends: [
          {
            env: {
              browser: false,
              node: true
            }
          },
          {
            env: {
              jest: true
            }
          }
        ]
      })

      expect(config.env).toEqual({
        browser: true,
        node: true,
        jest: true
      })
    })

    it('should move rules to global override', () => {
      const config = defineConfig({
        rules: {
          'eslint/no-console': 'off'
        }
      })

      expect(config).toEqual({
        overrides: [
          {
            files: ['**/*'],
            rules: {
              'eslint/no-console': 'off'
            }
          }
        ]
      })
    })

    it('should append rules override to existing overrides', () => {
      const override = {
        files: ['src/**/*.js'],
        rules: {
          'eslint/no-alert': 'off'
        }
      }
      const config = defineConfig({
        overrides: [override],
        rules: {
          'eslint/no-console': 'off'
        }
      })

      expect(config.overrides).toEqual([
        {
          files: ['**/*'],
          rules: {
            'eslint/no-console': 'off'
          }
        },
        override
      ])
    })

    it('should not mutate input config arrays', () => {
      const config = {
        ignorePatterns: ['dist'],
        overrides: [
          {
            files: ['src/**/*.js'],
            rules: {
              'eslint/no-alert': 'off'
            }
          }
        ],
        rules: {
          'eslint/no-console': 'off'
        },
        extends: [
          {
            ignorePatterns: ['coverage']
          }
        ]
      }

      defineConfig(config)

      expect(config.ignorePatterns).toEqual(['dist'])
      expect(config.overrides).toEqual([
        {
          files: ['src/**/*.js'],
          rules: {
            'eslint/no-alert': 'off'
          }
        }
      ])
      expect(config.rules).toEqual({
        'eslint/no-console': 'off'
      })
    })
  })
})
