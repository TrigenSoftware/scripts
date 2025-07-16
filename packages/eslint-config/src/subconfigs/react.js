/**
 * ReactJS config
 */

import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import stylisticPlugin from '@stylistic/eslint-plugin'
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
      'react-hooks': reactHooksPlugin,
      '@stylistic': stylisticPlugin
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
      '@stylistic/jsx-closing-bracket-location': 'error',
      '@stylistic/jsx-closing-tag-location': 'error',
      '@stylistic/jsx-curly-brace-presence': ['error', 'never'],
      '@stylistic/jsx-curly-newline': 'error',
      '@stylistic/jsx-curly-spacing': 'error',
      '@stylistic/jsx-equals-spacing': 'error',
      '@stylistic/jsx-first-prop-new-line': ['error', 'multiline'],
      'react/jsx-fragments': 'error',
      '@stylistic/jsx-indent-props': ['error', 2],
      'react/jsx-key': 'error',
      '@stylistic/jsx-max-props-per-line': [
        'error',
        {
          maximum: 1
        }
      ],
      '@stylistic/jsx-props-no-multi-spaces': 'error',
      '@stylistic/jsx-self-closing-comp': 'error',
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
      '@stylistic/jsx-one-expression-per-line': [
        'error',
        {
          allow: 'literal'
        }
      ],
      '@stylistic/jsx-pascal-case': 'error',
      '@stylistic/jsx-tag-spacing': [
        'error',
        {
          closingSlash: 'never',
          beforeSelfClosing: 'never',
          afterOpening: 'never'
        }
      ],
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      '@stylistic/jsx-wrap-multilines': [
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
      ],
      '@stylistic/jsx-function-call-newline': ['error', 'always'],
      '@stylistic/jsx-child-element-spacing': 'error'
    }
  }
]
