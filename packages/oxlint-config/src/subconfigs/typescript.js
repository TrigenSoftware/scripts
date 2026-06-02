/**
 * TypeScript config
 */

import {
  dtsFiles,
  tsFiles
} from './files.js'

export default {
  overrides: [
    {
      files: tsFiles,
      plugins: ['typescript'],
      jsPlugins: ['@trigen/oxlint-config/plugin'],
      rules: {
        // Recommended
        'typescript/ban-ts-comment': [
          'error',
          {
            'ts-expect-error': 'allow-with-description',
            'ts-ignore': true,
            'ts-nocheck': 'allow-with-description',
            'ts-check': false
          }
        ],
        'typescript/no-duplicate-enum-values': 'error',
        'typescript/no-empty-object-type': [
          'error',
          {
            allowInterfaces: 'with-single-extends'
          }
        ],
        'typescript/no-explicit-any': 'error',
        'typescript/no-extra-non-null-assertion': 'error',
        'typescript/no-misused-new': 'error',
        'typescript/no-namespace': [
          'error',
          {
            allowDeclarations: true,
            allowDefinitionFiles: true
          }
        ],
        'typescript/no-non-null-asserted-optional-chain': 'error',
        'typescript/no-require-imports': 'error',
        'typescript/no-this-alias': [
          'error',
          {
            allowDestructuring: true,
            allowedNames: ['self']
          }
        ],
        'typescript/no-unnecessary-type-constraint': 'error',
        'typescript/no-unsafe-declaration-merging': 'error',
        'typescript/no-unsafe-function-type': 'error',
        'typescript/no-wrapper-object-types': 'error',
        'typescript/prefer-as-const': 'error',
        'typescript/prefer-namespace-keyword': 'off',
        'typescript/triple-slash-reference': 'error',

        // Rules
        'typescript/array-type': 'error',
        'typescript/await-thenable': 'off',
        'typescript/consistent-type-definitions': 'error',
        'typescript/consistent-type-exports': [
          'error',
          {
            fixMixedExportsWithInlineTypeSpecifier: true
          }
        ],
        'typescript/explicit-module-boundary-types': 'off',
        'typescript/no-dynamic-delete': 'error',
        'typescript/no-extraneous-class': 'error',
        'typescript/no-invalid-void-type': 'error',
        'typescript/prefer-for-of': 'error',
        'typescript/prefer-function-type': 'error',
        'typescript/unified-signatures': 'error',
        'trigen/member-ordering': [
          'error',
          {
            default: {
              order: 'as-written',
              memberTypes: [
                'public-static-method',
                'protected-static-method',
                'private-static-method',
                'public-static-field',
                'protected-static-field',
                'private-static-field',
                'public-decorated-field',
                'protected-decorated-field',
                'private-decorated-field',
                'public-instance-field',
                'protected-instance-field',
                'private-instance-field',
                'public-abstract-field',
                'protected-abstract-field',
                'signature',
                'public-constructor',
                'protected-constructor',
                'private-constructor',
                'instance-method'
              ]
            }
          }
        ]
      }
    },
    {
      files: dtsFiles,
      rules: {
        'import/unambiguous': 'off'
      }
    }
  ]
}
