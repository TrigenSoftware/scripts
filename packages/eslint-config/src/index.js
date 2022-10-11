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
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true
    }
  },
  overrides: [
    {
      files: 'rollup.config.js',
      rules: {
        'import/no-default-export': 'off'
      }
    }
  ]
}
