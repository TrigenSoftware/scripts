import base from './index.js'

export default {
  ...base,
  rules: {
    ...base.rules,
    'require-version': 'off',
    'require-keywords': 'off',
    'require-private': 'error',
    'valid-values-private': ['error', [true]]
  },
  overrides: [
    {
      patterns: ['packages/*/package.json'],
      rules: {
        ...base.rules,
        'require-version': 'error',
        'require-private': 'off',
        'valid-values-private': 'off',
        'require-repository-directory': 'error'
      }
    }
  ]
}
