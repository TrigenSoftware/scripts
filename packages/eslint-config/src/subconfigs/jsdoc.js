/**
 * JSDoc config
 */

import jsdocPlugin from 'eslint-plugin-jsdoc'
import { tsFiles } from './files.js'

export default [
  jsdocPlugin.configs['flat/recommended'],
  {
    plugins: {
      jsdoc: jsdocPlugin
    },
    settings: {
      jsdoc: {
        mode: 'typescript'
      }
    },
    rules: {
      'jsdoc/check-property-names': [
        'warn',
        {
          enableFixer: true
        }
      ],
      'jsdoc/tag-lines': ['error', 'never'],
      'jsdoc/no-undefined-types': 'off',
      'jsdoc/require-hyphen-before-param-description': ['warn', 'always'],
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-returns-type': 'off'
    }
  },
  {
    files: tsFiles,
    rules: {
      'jsdoc/no-types': 'warn'
    }
  }
]
