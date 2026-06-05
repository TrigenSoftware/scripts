/**
 * JSDoc config
 */

import { tsFiles } from './files.js'

export default {
  plugins: ['jsdoc'],
  rules: {
    // Recommended
    'jsdoc/check-access': 'warn',
    'jsdoc/check-property-names': 'warn',
    'jsdoc/check-tag-names': 'warn',
    'jsdoc/empty-tags': 'warn',
    'jsdoc/implements-on-classes': 'warn',
    'jsdoc/no-defaults': 'warn',
    'jsdoc/require-param': 'warn',
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-param-name': 'warn',
    'jsdoc/require-param-type': 'off',
    'jsdoc/require-property': 'warn',
    'jsdoc/require-property-description': 'warn',
    'jsdoc/require-property-name': 'warn',
    'jsdoc/require-property-type': 'warn',
    'jsdoc/require-returns': 'warn',
    'jsdoc/require-returns-description': 'warn',
    'jsdoc/require-returns-type': 'off',
    'jsdoc/require-throws-type': 'warn',
    'jsdoc/require-yields': 'warn',
    'jsdoc/require-yields-type': 'warn'
  },
  overrides: [
    {
      files: tsFiles,
      plugins: ['jsdoc'],
      rules: {
        'jsdoc/require-param': 'off',
        'jsdoc/require-yields-type': 'off'
      }
    }
  ]
}
