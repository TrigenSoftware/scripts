/**
 * ECMAScript 6 config
 */

import importPlugin from 'eslint-plugin-import'

export default [
  {
    plugins: {
      import: importPlugin
    },
    rules: {
      // Import
      // Static analysis
      'import/no-absolute-path': 'error',
      'import/no-dynamic-require': 'error',
      'import/no-webpack-loader-syntax': 'error',
      'import/no-self-import': 'error',
      'import/no-cycle': [
        'error',
        {
          ignoreExternal: true
        }
      ],
      'import/no-useless-path-segments': [
        'error',
        {
          noUselessIndex: true
        }
      ],
      // Helpful warnings
      'import/export': 'error',
      'import/no-mutable-exports': 'error',
      // Module systems
      'import/no-amd': 'error',
      // Style guide
      'import/first': 'error',
      'import/no-duplicates': 'error',
      'import/order': [
        'error',
        {
          'groups': [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index'
          ],
          'newlines-between': 'never'
        }
      ],
      'import/newline-after-import': 'error',
      'import/no-default-export': 'error',
      'import/no-named-default': 'error',
      'import/no-anonymous-default-export': [
        'error',
        {
          allowArray: true,
          allowArrowFunction: false,
          allowAnonymousClass: false,
          allowAnonymousFunction: false,
          allowCallExpression: false,
          allowLiteral: false,
          allowObject: true
        }
      ],

      // Other
      'arrow-body-style': ['error', 'as-needed'],
      'arrow-parens': [
        'error',
        'as-needed',
        {
          requireForBlockBody: true
        }
      ],
      'arrow-spacing': 'error',
      'generator-star-spacing': ['error', 'after'],
      'no-confusing-arrow': [
        'error',
        {
          allowParens: true
        }
      ],
      'no-duplicate-imports': 'off', // in favor of import/no-duplicates
      'no-useless-computed-key': 'error',
      'no-useless-constructor': 'error',
      'no-useless-rename': 'error',
      'no-var': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-arrow-callback': [
        'error',
        {
          allowNamedFunctions: true
        }
      ],
      'prefer-const': [
        'error',
        {
          destructuring: 'all',
          ignoreReadBeforeAssign: false
        }
      ],
      'prefer-destructuring': 'off',
      'prefer-numeric-literals': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'rest-spread-spacing': ['error', 'never'],
      'symbol-description': 'error',
      'template-curly-spacing': 'error',
      'yield-star-spacing': ['error', 'after']
    }
  }
]
