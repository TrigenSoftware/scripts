/**
 * ReactJS config
 */

import {
  jsxFiles,
  reactFiles
} from './files.js'

export default {
  overrides: [
    {
      files: jsxFiles,
      rules: {
        'jsdoc/require-param': 'off',
        'jsdoc/require-returns': 'off'
      }
    },
    {
      files: reactFiles,
      plugins: ['react'],
      rules: {
        // React
        'react/no-array-index-key': 'warn',
        'react/no-children-prop': 'error',
        'react/no-danger': 'warn',
        'react/no-danger-with-children': 'error',
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
        'react/no-unescaped-entities': 'error',
        'react/no-unknown-property': 'error',
        'react/no-unsafe': 'error',
        'react/no-will-update-set-state': 'error',
        'react/prefer-es6-class': 'error',
        'react/react-in-jsx-scope': 'off',
        'react/require-render-return': 'error',
        'react/self-closing-comp': 'error',
        'react/style-prop-object': 'error',
        'react/void-dom-elements-no-children': 'error',

        // Hooks
        'react/rules-of-hooks': 'error',
        'react/exhaustive-deps': 'warn',

        // JSX
        'react/jsx-boolean-value': 'error',
        'react/jsx-fragments': 'error',
        'react/jsx-key': 'error',
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
        'react/jsx-no-useless-fragment': 'error'
      }
    }
  ]
}
