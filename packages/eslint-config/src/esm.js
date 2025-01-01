/**
 * ESM override
 */

module.exports = {
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      rules: {
        'import/no-useless-path-segments': [
          'error',
          {
            noUselessIndex: false
          }
        ],
        'import/extensions': ['error', 'ignorePackages']
      }
    }
  ]
}
