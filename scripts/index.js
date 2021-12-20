import { rm } from '@trigen/scripts'
import { jest } from '@trigen/scripts-plugin-jest'
import { eslint } from '@trigen/scripts-plugin-eslint'
import { diff } from './tasks.js'

export default {
  diff: {
    title: 'Diif two modules',
    run: diff()
  },
  lint: {
    title: 'Lint',
    run: eslint({
      files: ['packages/**/*.{js,jsx,ts,tsx}', 'scripts/**/*.js']
    })
  },
  jest: {
    title: 'Jest',
    run: jest({
      esm: true
    })
  },
  test: {
    title: 'Test',
    run: ['lint', 'jest'],
    parallel: true
  },
  clean: {
    title: 'Clean',
    run: rm([
      './packages/*/dist',
      './coverage',
      './node_modules/.cache'
    ])
  }
}
