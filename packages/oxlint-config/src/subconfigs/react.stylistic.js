/**
 * React stylistic config
 */

import { reactFiles } from './files.js'

export default {
  overrides: [
    {
      files: reactFiles,
      plugins: ['react'],
      jsPlugins: [
        {
          name: 'stylistic-js',
          specifier: '@stylistic/eslint-plugin'
        }
      ],
      rules: {
        'stylistic-js/jsx-child-element-spacing': 'error',
        'stylistic-js/jsx-closing-bracket-location': 'error',
        'stylistic-js/jsx-closing-tag-location': 'error',
        'react/jsx-curly-brace-presence': ['error', 'never'],
        'stylistic-js/jsx-curly-newline': 'error',
        'stylistic-js/jsx-curly-spacing': 'error',
        'stylistic-js/jsx-equals-spacing': 'error',
        'stylistic-js/jsx-first-prop-new-line': ['error', 'multiline'],
        'stylistic-js/jsx-function-call-newline': ['error', 'always'],
        'stylistic-js/jsx-indent-props': ['error', 2],
        'stylistic-js/jsx-max-props-per-line': [
          'error',
          {
            maximum: 1
          }
        ],
        'stylistic-js/jsx-one-expression-per-line': [
          'error',
          {
            allow: 'literal'
          }
        ],
        'react/jsx-pascal-case': 'error',
        'stylistic-js/jsx-self-closing-comp': 'error',
        'stylistic-js/jsx-tag-spacing': [
          'error',
          {
            closingSlash: 'never',
            beforeSelfClosing: 'never',
            afterOpening: 'never'
          }
        ],
        'stylistic-js/jsx-wrap-multilines': [
          'error',
          {
            declaration: 'parens-new-line',
            assignment: 'parens-new-line',
            return: 'parens-new-line',
            arrow: 'parens-new-line',
            condition: 'parens-new-line',
            logical: 'parens-new-line',
            prop: 'parens-new-line'
          }
        ]
      }
    }
  ]
}
