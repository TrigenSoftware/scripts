/**
 * ESM override
 */

module.exports = {
  overrides: [
    {
      files: ['*.js'],
      rules: {
        'import/no-useless-path-segments': [
          'error',
          {
            noUselessIndex: false
          }
        ],
        'import/dynamic-import-chunkname': 'off',
        'import/extensions': ['error', 'ignorePackages']
      }
    }
  ]
}
