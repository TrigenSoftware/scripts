/**
 * Basic config
 */

import stylisticPlugin from '@stylistic/eslint-plugin'

export default [
  {
    plugins: {
      '@stylistic': stylisticPlugin
    },
    rules: {
      // Possible Errors
      'no-console': [
        'warn',
        {
          allow: [
            'warn',
            'error',
            'info'
          ]
        }
      ],
      'no-debugger': 'warn',
      '@stylistic/no-extra-parens': [
        'error',
        'all',
        {
          nestedBinaryExpressions: false,
          ignoreJSX: 'multi-line',
          enforceForArrowConditionals: false,
          enforceForSequenceExpressions: false
        }
      ],
      'no-loss-of-precision': 'error',
      'no-template-curly-in-string': 'error',
      'no-useless-backreference': 'error',
      'require-atomic-updates': 'error',
      'valid-typeof': [
        'error',
        {
          requireStringLiterals: true
        }
      ],

      // Best Practices
      'array-callback-return': 'error',
      'block-scoped-var': 'error',
      'consistent-return': 'error',
      'curly': 'error',
      'default-case-last': 'error',
      '@stylistic/dot-location': ['error', 'property'],
      'dot-notation': 'error',
      'eqeqeq': 'error',
      'grouped-accessor-pairs': ['error', 'getBeforeSet'],
      'max-classes-per-file': 'error',
      'no-alert': 'warn',
      'no-caller': 'error',
      'no-constructor-return': 'error',
      'no-else-return': 'error',
      'no-empty-function': 'warn',
      'no-eq-null': 'error',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-label': 'error',
      'no-implicit-coercion': 'error',
      'no-implicit-globals': 'error',
      'no-implied-eval': 'error',
      'no-iterator': 'error',
      'no-labels': 'error',
      'no-lone-blocks': 'error',
      'no-loop-func': 'error',
      'no-magic-numbers': [
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
          detectObjects: false
        }
      ],
      '@stylistic/no-multi-spaces': 'error',
      'no-multi-str': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-octal-escape': 'error',
      'no-param-reassign': [
        'error',
        {
          props: false
        }
      ],
      'no-proto': 'error',
      'no-return-assign': 'error',
      'no-script-url': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unused-expressions': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'no-void': 'error',
      'prefer-promise-reject-errors': 'error',
      'radix': 'off',
      'require-await': 'error',
      'yoda': [
        'error',
        'never',
        {
          exceptRange: true
        }
      ],

      // Variables
      'no-label-var': 'error',
      'no-restricted-globals': ['error', 'event'],
      'no-undef-init': 'error',
      'no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_'
        }
      ],
      'no-use-before-define': [
        'error',
        {
          functions: false
        }
      ],

      // Stylistic Issues
      '@stylistic/array-bracket-newline': [
        'error',
        {
          multiline: true
        }
      ],
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/array-element-newline': [
        'error',
        {
          multiline: true,
          minItems: 3
        }
      ],
      '@stylistic/block-spacing': 'error',
      '@stylistic/brace-style': ['error', '1tbs'],
      'camelcase': 'error',
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/comma-spacing': 'error',
      '@stylistic/comma-style': 'error',
      '@stylistic/computed-property-spacing': 'error',
      'consistent-this': ['error', 'self'],
      '@stylistic/eol-last': 'error',
      '@stylistic/function-call-spacing': 'error',
      'func-names': 'error',
      'func-style': [
        'error',
        'declaration',
        {
          allowArrowFunctions: true
        }
      ],
      '@stylistic/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/function-paren-newline': ['error', 'consistent'],
      '@stylistic/implicit-arrow-linebreak': ['error', 'beside'],
      '@stylistic/indent': [
        'error',
        2,
        {
          ignoredNodes: ['TSTypeParameterInstantiation', 'TSIntersectionType'],
          SwitchCase: 1
        }
      ],
      '@stylistic/indent-binary-ops': ['error', 2],
      '@stylistic/jsx-quotes': ['error', 'prefer-single'],
      '@stylistic/key-spacing': [
        'error',
        {
          mode: 'strict'
        }
      ],
      '@stylistic/keyword-spacing': 'error',
      '@stylistic/linebreak-style': 'error',
      '@stylistic/lines-between-class-members': [
        'error',
        'always',
        {
          exceptAfterSingleLine: true
        }
      ],
      'max-nested-callbacks': ['error', 4],
      'max-params': ['error', 6],
      '@stylistic/max-statements-per-line': 'error',
      'new-cap': [
        'error',
        {
          capIsNew: false
        }
      ],
      '@stylistic/new-parens': 'error',
      'no-array-constructor': 'error',
      'no-lonely-if': 'error',
      'no-multi-assign': 'error',
      '@stylistic/no-multiple-empty-lines': [
        'error',
        {
          max: 1
        }
      ],
      'no-new-object': 'error',
      '@stylistic/no-trailing-spaces': 'error',
      'no-unneeded-ternary': 'error',
      '@stylistic/no-whitespace-before-property': 'error',
      '@stylistic/curly-newline': ['error', 'always'],
      '@stylistic/object-curly-newline': [
        'error',
        {
          ObjectExpression: {
            minProperties: 1
          },
          ObjectPattern: {
            multiline: true
          },
          ImportDeclaration: {
            multiline: true
          },
          ExportDeclaration: {
            multiline: true
          }
        }
      ],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/object-property-newline': [
        'error',
        {
          allowAllPropertiesOnSameLine: false
        }
      ],
      'one-var': ['error', 'never'],
      '@stylistic/one-var-declaration-per-line': ['error', 'initializations'],
      'operator-assignment': ['error', 'always'],
      '@stylistic/operator-linebreak': [
        'error',
        'before',
        {
          overrides: {
            '=': 'after'
          }
        }
      ],
      '@stylistic/padded-blocks': ['error', 'never'],
      '@stylistic/padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: 'import',
          next: '*'
        },
        {
          blankLine: 'never',
          prev: 'import',
          next: 'import'
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'block-like'
        },
        {
          blankLine: 'always',
          prev: 'block-like',
          next: '*'
        },
        {
          blankLine: 'always',
          prev: '*',
          next: ['const', 'let']
        },
        {
          blankLine: 'always',
          prev: ['const', 'let'],
          next: '*'
        },
        {
          blankLine: 'never',
          prev: ['const', 'let'],
          next: ['const', 'let']
        },
        {
          blankLine: 'always',
          prev: ['cjs-import'],
          next: '*'
        },
        {
          blankLine: 'never',
          prev: ['cjs-import'],
          next: ['cjs-import']
        }
      ],
      'prefer-object-spread': 'error',
      '@stylistic/quote-props': ['error', 'consistent-as-needed'],
      '@stylistic/quotes': [
        'error',
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: true
        }
      ],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/space-before-blocks': 'error',
      '@stylistic/space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always'
        }
      ],
      '@stylistic/space-in-parens': 'error',
      '@stylistic/space-infix-ops': [
        'error',
        {
          int32Hint: true
        }
      ],
      '@stylistic/space-unary-ops': 'error',
      '@stylistic/spaced-comment': 'error',
      '@stylistic/switch-colon-spacing': 'error',
      '@stylistic/template-tag-spacing': 'error',
      '@stylistic/no-floating-decimal': 'error',
      '@stylistic/no-extra-semi': 'error',
      '@stylistic/semi-spacing': 'error',
      '@stylistic/multiline-ternary': ['error', 'always-multiline'],
      '@stylistic/no-tabs': 'error',
      '@stylistic/no-mixed-spaces-and-tabs': 'error',
      'unicode-bom': 'error'
    }
  }
]
