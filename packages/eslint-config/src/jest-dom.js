/**
 * Jest DOM override
 */
const { makePatterns } = require('./utils')

const postfixes = ['spec', 'mock']
const extensions = [
  'js',
  'jsx',
  'ts',
  'tsx'
]

module.exports = {
  overrides: [
    {
      files: makePatterns(postfixes, extensions),
      plugins: ['jest-dom'],
      extends: ['plugin:jest-dom/recommended']
    }
  ]
}
