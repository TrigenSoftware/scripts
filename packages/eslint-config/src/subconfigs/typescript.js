/**
 * TypeScript config
 */

import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import stylisticPlugin from '@stylistic/eslint-plugin'
import { getExtensionRules } from './utils.js'
import { dtsFiles } from './files.js'

export default [
  {
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      '@stylistic': stylisticPlugin
    },
    rules: {
      // Rules
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': true,
          'ts-nocheck': 'allow-with-description',
          'ts-check': false
        }
      ],
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'none',
            requireLast: true
          },
          singleline: {
            delimiter: 'comma',
            requireLast: false
          }
        }
      ],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: {
            order: 'as-written',
            memberTypes: [
              // Static methods
              'public-static-method',
              'protected-static-method',
              'private-static-method',

              // Static fields
              'public-static-field',
              'protected-static-field',
              'private-static-field',

              // Fields
              'public-decorated-field',
              'protected-decorated-field',
              'private-decorated-field',
              'public-instance-field',
              'protected-instance-field',
              'private-instance-field',
              'public-abstract-field',
              'protected-abstract-field',

              // Index signature
              'signature',

              // Constructors
              'public-constructor',
              'protected-constructor',
              'private-constructor',

              // Methods
              'instance-method'
            ]
          }
        }
      ],
      '@typescript-eslint/method-signature-style': ['error', 'method'],
      'camelcase': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: [
            'camelCase',
            'PascalCase',
            'UPPER_CASE'
          ]
        },
        {
          selector: 'variable',
          format: [
            'camelCase',
            'UPPER_CASE',
            'PascalCase'
          ]
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase']
        },
        {
          selector: 'parameter',
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow'
        },
        {
          selector: 'typeLike',
          format: ['PascalCase']
        },
        {
          selector: 'interface',
          format: ['PascalCase']
        },
        {
          selector: 'enumMember',
          format: ['PascalCase']
        },
        {
          selector: 'classProperty',
          format: [
            'camelCase',
            'UPPER_CASE',
            'PascalCase'
          ],
          modifiers: ['static']
        },
        {
          selector: ['objectLiteralProperty', 'objectLiteralMethod'],
          format: null,
          modifiers: ['requiresQuotes']
        }
      ],
      '@typescript-eslint/no-dynamic-delete': 'error',
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {
          allowInterfaces: 'with-single-extends'
        }
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-extraneous-class': 'error',
      '@typescript-eslint/no-invalid-void-type': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/no-namespace': [
        'error',
        {
          allowDeclarations: true,
          allowDefinitionFiles: true
        }
      ],
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-this-alias': [
        'error',
        {
          allowDestructuring: true,
          allowedNames: ['self']
        }
      ],
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/prefer-namespace-keyword': 'off',
      '@stylistic/type-annotation-spacing': 'error',
      '@stylistic/type-generic-spacing': 'error',
      '@stylistic/type-named-tuple-spacing': 'error',
      '@typescript-eslint/unified-signatures': 'error',

      // Extension
      ...getExtensionRules('@typescript-eslint', [
        'no-array-constructor',
        'no-empty-function',
        'no-magic-numbers',
        'no-unused-expressions',
        'no-unused-vars',
        'no-use-before-define',
        'no-useless-constructor'
      ]),
      // Override eslint:recommended
      'no-dupe-class-members': 'off',
      '@typescript-eslint/no-dupe-class-members': 'error'
    }
  },
  {
    files: dtsFiles,
    rules: {
      'import/unambiguous': 'off'
    }
  }
]
