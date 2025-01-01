/**
 * ESM override
 */

module.exports = {
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
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
