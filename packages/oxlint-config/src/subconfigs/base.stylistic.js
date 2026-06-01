/**
 * Base stylistic config
 */

export default {
  jsPlugins: [
    {
      name: 'stylistic-js',
      specifier: '@stylistic/eslint-plugin'
    }
  ],
  rules: {
    // Possible Errors
    'stylistic-js/no-extra-parens': [
      'error',
      'all',
      {
        nestedBinaryExpressions: false,
        ignoreJSX: 'multi-line',
        ignoredNodes: ['ArrowFunctionExpression[body.type=ConditionalExpression]'],
        enforceForSequenceExpressions: false
      }
    ],

    // Best Practices
    'stylistic-js/dot-location': ['error', 'property'],
    'stylistic-js/no-multi-spaces': 'error',

    // Stylistic Issues
    'stylistic-js/array-bracket-newline': [
      'error',
      'consistent'
    ],
    'stylistic-js/array-bracket-spacing': ['error', 'never'],
    'stylistic-js/array-element-newline': [
      'error',
      {
        consistent: true,
        multiline: true
      }
    ],
    'stylistic-js/arrow-parens': [
      'error',
      'as-needed',
      {
        requireForBlockBody: true
      }
    ],
    'stylistic-js/arrow-spacing': 'error',
    'stylistic-js/block-spacing': 'error',
    'stylistic-js/brace-style': ['error', '1tbs'],
    'stylistic-js/comma-dangle': ['error', 'never'],
    'stylistic-js/comma-spacing': 'error',
    'stylistic-js/comma-style': 'error',
    'stylistic-js/computed-property-spacing': 'error',
    'stylistic-js/curly-newline': [
      'error',
      {
        minElements: 1
      }
    ],
    'stylistic-js/eol-last': 'error',
    'stylistic-js/function-call-argument-newline': ['error', 'consistent'],
    'stylistic-js/function-call-spacing': 'error',
    'stylistic-js/function-paren-newline': ['error', 'consistent'],
    'stylistic-js/generator-star-spacing': ['error', 'after'],
    'stylistic-js/implicit-arrow-linebreak': ['error', 'beside'],
    'stylistic-js/indent': [
      'error',
      2,
      {
        ignoredNodes: ['TSTypeParameterInstantiation', 'TSIntersectionType'],
        SwitchCase: 1
      }
    ],
    'stylistic-js/indent-binary-ops': 'off',
    'stylistic-js/jsx-quotes': ['error', 'prefer-single'],
    'stylistic-js/key-spacing': [
      'error',
      {
        mode: 'strict'
      }
    ],
    'stylistic-js/keyword-spacing': 'error',
    'stylistic-js/linebreak-style': 'error',
    'stylistic-js/lines-between-class-members': [
      'error',
      'always',
      {
        exceptAfterSingleLine: true
      }
    ],
    'stylistic-js/max-statements-per-line': 'error',
    'stylistic-js/multiline-ternary': ['error', 'always-multiline'],
    'stylistic-js/new-parens': 'error',
    'stylistic-js/no-confusing-arrow': [
      'error',
      {
        allowParens: true
      }
    ],
    'stylistic-js/no-extra-semi': 'error',
    'stylistic-js/no-floating-decimal': 'error',
    'stylistic-js/no-mixed-spaces-and-tabs': 'error',
    'stylistic-js/no-multiple-empty-lines': [
      'error',
      {
        max: 1
      }
    ],
    'stylistic-js/no-tabs': 'error',
    'stylistic-js/no-trailing-spaces': 'error',
    'stylistic-js/no-whitespace-before-property': 'error',
    'stylistic-js/object-curly-newline': [
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
    'stylistic-js/object-curly-spacing': ['error', 'always'],
    'stylistic-js/object-property-newline': [
      'error',
      {
        allowAllPropertiesOnSameLine: false
      }
    ],
    'stylistic-js/one-var-declaration-per-line': ['error', 'initializations'],
    'stylistic-js/operator-linebreak': [
      'error',
      'before',
      {
        overrides: {
          '=': 'after'
        }
      }
    ],
    'stylistic-js/padded-blocks': ['error', 'never'],
    'stylistic-js/padding-line-between-statements': [
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
    'stylistic-js/quote-props': ['error', 'consistent-as-needed'],
    'stylistic-js/quotes': [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: 'always'
      }
    ],
    'stylistic-js/rest-spread-spacing': ['error', 'never'],
    'stylistic-js/semi': ['error', 'never'],
    'stylistic-js/semi-spacing': 'error',
    'stylistic-js/space-before-blocks': 'error',
    'stylistic-js/space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }
    ],
    'stylistic-js/space-in-parens': 'error',
    'stylistic-js/space-infix-ops': [
      'error',
      {
        int32Hint: true
      }
    ],
    'stylistic-js/space-unary-ops': 'error',
    'stylistic-js/spaced-comment': 'error',
    'stylistic-js/switch-colon-spacing': 'error',
    'stylistic-js/template-curly-spacing': 'error',
    'stylistic-js/template-tag-spacing': 'error',
    'stylistic-js/yield-star-spacing': ['error', 'after']
  }
}
