/**
 * Basic config
 */

export default {
  jsPlugins: ['@trigen/oxlint-config/plugin'],
  rules: {
    'eslint/constructor-super': 'error',
    'eslint/for-direction': 'error',
    'eslint/getter-return': 'error',
    'eslint/no-async-promise-executor': 'error',
    'eslint/no-case-declarations': 'error',
    'eslint/no-class-assign': 'error',
    'eslint/no-compare-neg-zero': 'error',
    'eslint/no-cond-assign': 'error',
    'eslint/no-const-assign': 'error',
    'eslint/no-constant-binary-expression': 'error',
    'eslint/no-constant-condition': 'error',
    'eslint/no-control-regex': 'error',
    'eslint/no-debugger': 'warn',
    'eslint/no-delete-var': 'error',
    'eslint/no-dupe-class-members': 'error',
    'eslint/no-dupe-else-if': 'error',
    'eslint/no-dupe-keys': 'error',
    'eslint/no-duplicate-case': 'error',
    'eslint/no-empty': [
      'error',
      {
        allowEmptyCatch: true
      }
    ],
    'eslint/no-empty-character-class': 'error',
    'eslint/no-empty-pattern': 'error',
    'eslint/no-empty-static-block': 'error',
    'eslint/no-ex-assign': 'error',
    'eslint/no-extra-boolean-cast': 'error',
    'eslint/no-fallthrough': 'error',
    'eslint/no-func-assign': 'error',
    'eslint/no-global-assign': 'error',
    'eslint/no-import-assign': 'error',
    'eslint/no-invalid-regexp': 'error',
    'eslint/no-irregular-whitespace': 'error',
    'eslint/no-loss-of-precision': 'error',
    'eslint/no-misleading-character-class': 'error',
    'eslint/no-new-native-nonconstructor': 'error',
    'eslint/no-nonoctal-decimal-escape': 'error',
    'eslint/no-obj-calls': 'error',
    'eslint/no-prototype-builtins': 'error',
    'eslint/no-redeclare': 'error',
    'eslint/no-regex-spaces': 'error',
    'eslint/no-self-assign': 'error',
    'eslint/no-setter-return': 'error',
    'eslint/no-shadow-restricted-names': 'error',
    'eslint/no-sparse-arrays': 'error',
    'eslint/no-this-before-super': 'error',
    'eslint/no-unassigned-vars': 'error',
    'eslint/no-undef': 'error',
    'eslint/no-unexpected-multiline': 'error',
    'eslint/no-unreachable': 'error',
    'eslint/no-unsafe-finally': 'error',
    'eslint/no-unsafe-negation': 'error',
    'eslint/no-unsafe-optional-chaining': 'error',
    'eslint/no-unused-labels': 'error',
    'eslint/no-unused-private-class-members': 'error',
    'eslint/no-unused-vars': [
      'error',
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_'
      }
    ],
    'eslint/no-useless-assignment': 'error',
    'eslint/no-useless-backreference': 'error',
    'eslint/no-useless-catch': 'error',
    'eslint/no-useless-escape': 'error',
    'eslint/no-with': 'error',
    'eslint/require-yield': 'error',
    'eslint/use-isnan': 'error',
    'eslint/valid-typeof': [
      'error',
      {
        requireStringLiterals: true
      }
    ],
    'eslint/no-console': [
      'warn',
      {
        allow: [
          'warn',
          'error',
          'info'
        ]
      }
    ],
    'eslint/no-template-curly-in-string': 'error',
    'eslint/array-callback-return': 'error',
    'eslint/block-scoped-var': 'error',
    'eslint/curly': 'error',
    'eslint/default-case-last': 'error',
    'eslint/eqeqeq': 'error',
    'eslint/grouped-accessor-pairs': ['error', 'getBeforeSet'],
    'eslint/max-classes-per-file': 'error',
    'eslint/no-alert': 'warn',
    'eslint/no-caller': 'error',
    'eslint/no-constructor-return': 'error',
    'eslint/no-else-return': 'error',
    'eslint/no-empty-function': 'warn',
    'eslint/no-eq-null': 'error',
    'eslint/no-eval': 'error',
    'eslint/no-extend-native': 'error',
    'eslint/no-extra-bind': 'error',
    'eslint/no-extra-label': 'error',
    'eslint/no-implicit-coercion': 'error',
    'eslint/no-implicit-globals': 'error',
    'eslint/no-implied-eval': 'error',
    'eslint/no-iterator': 'error',
    'eslint/no-labels': 'error',
    'eslint/no-lone-blocks': 'error',
    'eslint/no-loop-func': 'error',
    'eslint/no-magic-numbers': [
      'error',
      {
        ignore: [
          -1,
          0,
          0.5,
          1,
          2,
          100
        ],
        ignoreArrayIndexes: true,
        ignoreClassFieldInitialValues: true,
        ignoreDefaultValues: true,
        ignoreEnums: true,
        ignoreNumericLiteralTypes: true,
        ignoreReadonlyClassProperties: true,
        ignoreTypeIndexes: true,
        detectObjects: false
      }
    ],
    'eslint/no-multi-str': 'error',
    'eslint/no-new': 'error',
    'eslint/no-new-func': 'error',
    'eslint/no-new-wrappers': 'error',
    'eslint/no-object-constructor': 'error',
    'eslint/no-param-reassign': [
      'error',
      {
        props: false
      }
    ],
    'eslint/no-promise-executor-return': 'off',
    'eslint/no-proto': 'error',
    'eslint/no-return-assign': 'error',
    'eslint/no-script-url': 'error',
    'eslint/no-self-compare': 'error',
    'eslint/no-sequences': 'error',
    'eslint/no-throw-literal': 'error',
    'eslint/no-unmodified-loop-condition': 'error',
    'eslint/no-unused-expressions': 'error',
    'eslint/no-useless-call': 'error',
    'eslint/no-useless-concat': 'error',
    'eslint/no-useless-return': 'error',
    'eslint/no-void': [
      'off',
      {
        allowAsStatement: true
      }
    ],
    'eslint/prefer-promise-reject-errors': 'error',
    'eslint/prefer-regex-literals': 'error',
    'eslint/preserve-caught-error': 'error',
    'eslint/radix': 'off',
    'eslint/require-await': 'error',
    'eslint/yoda': [
      'error',
      'never',
      {
        exceptRange: true
      }
    ],
    'eslint/no-label-var': 'error',
    'eslint/no-restricted-globals': ['error', 'event'],
    'eslint/no-use-before-define': [
      'error',
      {
        functions: false
      }
    ],
    'eslint/arrow-body-style': ['error', 'as-needed'],
    'eslint/logical-assignment-operators': [
      'error',
      'always',
      {
        enforceForIfStatements: true
      }
    ],
    'eslint/no-duplicate-imports': 'off',
    'eslint/no-useless-computed-key': 'error',
    'eslint/no-useless-constructor': 'error',
    'eslint/no-useless-rename': 'error',
    'eslint/no-var': 'error',
    'eslint/object-shorthand': ['error', 'always'],
    'eslint/prefer-arrow-callback': [
      'error',
      {
        allowNamedFunctions: true
      }
    ],
    'eslint/prefer-const': [
      'error',
      {
        destructuring: 'all',
        ignoreReadBeforeAssign: false
      }
    ],
    'eslint/prefer-destructuring': 'off',
    'eslint/prefer-numeric-literals': 'error',
    'eslint/prefer-object-has-own': 'error',
    'eslint/prefer-rest-params': 'error',
    'eslint/prefer-spread': 'error',
    'eslint/prefer-template': 'error',
    'eslint/symbol-description': 'error',
    'eslint/func-names': 'error',
    'eslint/func-style': [
      'error',
      'declaration',
      {
        allowArrowFunctions: true
      }
    ],
    'eslint/max-nested-callbacks': ['error', 4],
    'eslint/max-params': ['error', 6],
    'eslint/new-cap': [
      'error',
      {
        capIsNew: false
      }
    ],
    'eslint/no-array-constructor': 'error',
    'eslint/no-lonely-if': 'error',
    'eslint/no-multi-assign': 'error',
    'eslint/no-unneeded-ternary': 'error',
    'eslint/operator-assignment': ['error', 'always'],
    'eslint/prefer-object-spread': 'error',
    'eslint/unicode-bom': 'error',
    'trigen/naming-convention': [
      'error',
      {
        selector: 'default',
        format: [
          'camelCase',
          'PascalCase',
          'UPPER_CASE'
        ],
        leadingDollar: 'allow',
        trailingDollar: 'allow'
      },
      {
        selector: 'variable',
        format: [
          'camelCase',
          'UPPER_CASE',
          'PascalCase'
        ],
        leadingDollar: 'allow',
        trailingDollar: 'allow'
      },
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
        leadingDollar: 'allow',
        trailingDollar: 'allow'
      },
      {
        selector: 'parameter',
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'allow',
        leadingDollar: 'allow',
        trailingDollar: 'allow'
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
        trailingDollar: 'allow'
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
        trailingDollar: 'allow'
      },
      {
        selector: 'enumMember',
        format: ['PascalCase'],
        trailingDollar: 'allow'
      },
      {
        selector: 'classProperty',
        format: [
          'camelCase',
          'UPPER_CASE',
          'PascalCase'
        ],
        modifiers: ['static'],
        leadingDollar: 'allow',
        trailingDollar: 'allow'
      },
      {
        selector: ['objectLiteralProperty', 'objectLiteralMethod'],
        format: null,
        modifiers: ['requiresQuotes']
      }
    ]
  }
}
