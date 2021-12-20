/**
 * Combine all configs without ReactJS config
 */

module.exports = {
  extends: ['eslint:recommended', 'plugin:jsdoc/recommended'].concat([
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
