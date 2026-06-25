/**
 * Import config
 */

export default {
  plugins: ['import'],
  jsPlugins: ['@trigen/oxlint-config/plugin'],
  rules: {
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
    'import/export': 'error',
    'import/no-mutable-exports': 'error',
    'import/no-amd': 'error',
    'import/first': 'error',
    'import/no-duplicates': 'error',
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
    'trigen/import-order': [
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
        'pathGroups': [
          {
            pattern: '~/**',
            group: 'external',
            position: 'after'
          },
          {
            pattern: '#*/**',
            group: 'external',
            position: 'after'
          },
          {
            pattern: '@/**',
            group: 'external',
            position: 'after'
          }
        ],
        'newlines-between': 'never',
        'typeImports': 'first'
      }
    ],
    'trigen/named-import-order': [
      'error',
      {
        typeImports: 'first',
        patterns: [
          '^[A-Z][A-Z0-9_]*$',
          '^[A-Z][a-zA-Z0-9]*$',
          '^[a-z][a-zA-Z0-9]*$'
        ]
      }
    ],
    'trigen/named-export-order': [
      'error',
      {
        typeExports: 'first',
        patterns: [
          '^[A-Z][A-Z0-9_]*$',
          '^[A-Z][a-zA-Z0-9]*$',
          '^[a-z][a-zA-Z0-9]*$'
        ]
      }
    ]
  }
}
