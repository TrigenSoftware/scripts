/**
 * Combine all configs without ReactJS config
 */

module.exports = {
  plugins: ['security'],
  extends: [
    'eslint:recommended',
    'plugin:jsdoc/recommended',
    'plugin:security/recommended'
  ].concat([
    './rules/common',
    './rules/es6',
    './rules/jsdoc'
  ].map(require.resolve)),
  env: {
    es6: true
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
      experimentalObjectRestSpread: true,
      objectLiteralDuplicateProperties: false
    }
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      extends: ['./rules/babel'].map(require.resolve)
    }
  ]
}
