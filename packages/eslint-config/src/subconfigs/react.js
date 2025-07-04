/**
 * ReactJS config
 */

import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import {
  jsxFiles,
  reactFiles
} from './files.js'

export default [
  {
    files: jsxFiles,
    rules: {
      'jsdoc/require-param': 'off',
      'jsdoc/require-returns': 'off'
    }
  },
  {
    files: reactFiles,
    plugins: {
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      // React
      'react/destructuring-assignment': [
        'error',
        'always',
        {
          ignoreClassFields: true
        }
      ],
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'arrow-function'
        }
      ],
      'react/no-access-state-in-setstate': 'error',
      'react/no-array-index-key': 'warn',
      'react/no-children-prop': 'error',
      'react/no-danger': 'warn',
      'react/no-danger-with-children': 'error',
      'react/no-deprecated': 'error',
      'react/no-did-mount-set-state': 'error',
      'react/no-did-update-set-state': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-find-dom-node': 'error',
      'react/no-is-mounted': 'error',
      'react/no-multi-comp': [
        'error',
        {
          ignoreStateless: true
        }
      ],
      'react/no-redundant-should-component-update': 'error',
      'react/no-render-return-value': 'error',
      'react/no-string-refs': 'error',
      'react/no-this-in-sfc': 'error',
      'react/no-typos': 'error',
      'react/no-unescaped-entities': 'error',
      'react/no-unknown-property': 'error',
      'react/no-unsafe': 'error',
      'react/no-unused-prop-types': 'error',
      'react/no-unused-state': 'error',
      'react/no-will-update-set-state': 'error',
      'react/prefer-es6-class': 'error',
      'react/prefer-stateless-function': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/require-render-return': 'error',
      'react/self-closing-comp': 'error',
      'react/static-property-placement': ['error', 'static public field'],
      'react/style-prop-object': 'error',
      'react/void-dom-elements-no-children': 'error',

      // Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // JSX
      'react/jsx-boolean-value': 'error',
      'react/jsx-closing-bracket-location': 'error',
      'react/jsx-closing-tag-location': 'error',
      'react/jsx-curly-brace-presence': ['error', 'never'],
      'react/jsx-curly-newline': 'error',
      'react/jsx-curly-spacing': 'error',
      'react/jsx-equals-spacing': 'error',
      'react/jsx-first-prop-new-line': ['error', 'multiline'],
      'react/jsx-fragments': 'error',
      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],
      'react/jsx-key': 'error',
      'react/jsx-max-props-per-line': [
        'error',
        {
          maximum: 1
        }
      ],
      'react/jsx-no-bind': 'error',
      'react/jsx-no-comment-textnodes': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-script-url': 'error',
      'react/jsx-no-target-blank': [
        'error',
        {
          enforceDynamicLinks: 'always'
        }
      ],
      'react/jsx-no-undef': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-one-expression-per-line': [
        'error',
        {
          allow: 'literal'
        }
      ],
      'react/jsx-pascal-case': 'error',
      'react/jsx-tag-spacing': [
        'error',
        {
          closingSlash: 'never',
          beforeSelfClosing: 'never',
          afterOpening: 'never'
        }
      ],
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/jsx-wrap-multilines': [
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
