const base = require('.')

module.exports = {
  rules: {
    'require-keywords': 'off',
    'require-private': 'error',
    'valid-values-private': ['error', [true]]
  },
  overrides: [
    {
      patterns: ['packages/*/package.json'],
      rules: {
        'require-private': 'off',
        'valid-values-private': 'off',
        'require-repository-directory': 'error',
        ...base.rules
      }
    }
  ]
}
