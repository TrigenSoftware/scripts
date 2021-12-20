/**
 * Common config
 */

const getExtensionRules = require('./getExtensionRules')

module.exports = {
  plugins: ['@babel'],
  rules: getExtensionRules('@babel', [
    'no-unused-expressions',
    'new-cap',
    'object-curly-spacing',
    'semi'
  ])
}
