/**
 * CommonJS override
 */

module.exports = {
  overrides: [
    {
      files: ['*.js'],
      rules: {
        'import/no-commonjs': 'off',
        'import/unambiguous': 'off'
      }
    }
  ]
}
