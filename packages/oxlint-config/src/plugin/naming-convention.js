const formatPatterns = {
  camelCase: /^[a-z][a-zA-Z0-9]*$/,
  PascalCase: /^[A-Z][a-zA-Z0-9]*$/,
  UPPER_CASE: /^[A-Z][A-Z0-9_]*$/
}

function toArray(value) {
  return Array.isArray(value) ? value : [value]
}

function getSelectorOptions(options, selector, modifiers = []) {
  return options
    .filter((option) => {
      const selectors = toArray(option.selector)
      const optionModifiers = option.modifiers ?? []

      return (
        selectors.includes(selector)
        || selectors.includes('default')
      )
        && optionModifiers.every(modifier => modifiers.includes(modifier))
    })
    .sort((left, right) => {
      const leftSelectors = toArray(left.selector)
      const rightSelectors = toArray(right.selector)
      const leftScore = leftSelectors.includes(selector) ? 1 : 0
      const rightScore = rightSelectors.includes(selector) ? 1 : 0

      return leftScore - rightScore
        || (left.modifiers?.length ?? 0) - (right.modifiers?.length ?? 0)
    })
    .at(-1)
}

function getNormalizedName(name, option) {
  let normalizedName = name

  if (option.leadingUnderscore === 'allow') {
    normalizedName = normalizedName.replace(/^_+/, '')
  }

  if (option.leadingDollar === 'allow') {
    normalizedName = normalizedName.replace(/^\$+/, '')
  }

  if (option.trailingDollar === 'allow') {
    normalizedName = normalizedName.replace(/\$+$/, '')
  }

  return normalizedName
}

function matchesFormat(name, format) {
  return formatPatterns[format]?.test(name) ?? true
}

function getExpectedFormats(format) {
  return format.join(', ')
}

function isValidName(name, option) {
  if (option?.format === null) {
    return true
  }

  if (!option?.format) {
    return true
  }

  const normalizedName = getNormalizedName(name, option)

  return normalizedName === ''
    || option.format.some(format => matchesFormat(normalizedName, format))
}

function getKeyName(key) {
  if (!key) {
    return null
  }

  if (key.type === 'Identifier' || key.type === 'PrivateIdentifier') {
    return key.name
  }

  if (
    key.type === 'Literal'
    || key.type === 'StringLiteral'
    || key.type === 'NumericLiteral'
  ) {
    return String(key.value)
  }

  return null
}

function isIdentifierName(name) {
  return /^[A-Za-z_$][\w$]*$/.test(name)
}

function requiresQuotes(node) {
  if (node.computed) {
    return false
  }

  const name = getKeyName(node.key)

  return name !== null && !isIdentifierName(name)
}

function getPropertyModifiers(node) {
  const modifiers = []

  if (node.static) {
    modifiers.push('static')
  }

  if (requiresQuotes(node)) {
    modifiers.push('requiresQuotes')
  }

  return modifiers
}

function getIdentifierNames(pattern) {
  if (!pattern) {
    return []
  }

  if (pattern.type === 'Identifier') {
    return [
      {
        name: pattern.name,
        node: pattern
      }
    ]
  }

  if (pattern.type === 'RestElement') {
    return getIdentifierNames(pattern.argument)
  }

  if (pattern.type === 'AssignmentPattern') {
    return getIdentifierNames(pattern.left)
  }

  if (pattern.type === 'ArrayPattern') {
    return pattern.elements.flatMap(getIdentifierNames)
  }

  if (pattern.type === 'ObjectPattern') {
    return pattern.properties.flatMap(property => (
      property.type === 'Property'
        ? getIdentifierNames(property.value)
        : getIdentifierNames(property.argument)
    ))
  }

  return []
}

function getParameterNode(parameter) {
  return parameter.type === 'TSParameterProperty'
    ? parameter.parameter
    : parameter
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce configured naming conventions.'
    },
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          selector: {
            anyOf: [
              {
                type: 'string'
              },
              {
                type: 'array',
                items: {
                  type: 'string'
                }
              }
            ]
          },
          format: {
            anyOf: [
              {
                type: 'array',
                items: {
                  type: 'string'
                }
              },
              {
                type: 'null'
              }
            ]
          },
          leadingUnderscore: {
            type: 'string'
          },
          leadingDollar: {
            type: 'string'
          },
          trailingDollar: {
            type: 'string'
          },
          modifiers: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        },
        required: ['selector'],
        additionalProperties: true
      }
    }
  },
  create(context) {
    const options = context.options

    function check(name, node, selector, modifiers = []) {
      const option = getSelectorOptions(options, selector, modifiers)

      if (!option || isValidName(name, option)) {
        return
      }

      context.report({
        node,
        message: `Name "${name}" must match one of these formats: ${getExpectedFormats(option.format)}.`
      })
    }

    function checkPattern(pattern, selector) {
      for (const item of getIdentifierNames(pattern)) {
        check(item.name, item.node, selector)
      }
    }

    function checkProperty(node, selector) {
      const name = getKeyName(node.key)

      if (name === null) {
        return
      }

      check(name, node.key, selector, getPropertyModifiers(node))
    }

    return {
      VariableDeclarator(node) {
        checkPattern(node.id, 'variable')
      },
      FunctionDeclaration(node) {
        if (node.id) {
          check(node.id.name, node.id, 'function')
        }

        for (const parameter of node.params) {
          checkPattern(getParameterNode(parameter), 'parameter')
        }
      },
      FunctionExpression(node) {
        if (node.id) {
          check(node.id.name, node.id, 'function')
        }

        for (const parameter of node.params) {
          checkPattern(getParameterNode(parameter), 'parameter')
        }
      },
      ArrowFunctionExpression(node) {
        for (const parameter of node.params) {
          checkPattern(getParameterNode(parameter), 'parameter')
        }
      },
      ClassDeclaration(node) {
        if (node.id) {
          check(node.id.name, node.id, 'typeLike')
        }
      },
      TSTypeAliasDeclaration(node) {
        check(node.id.name, node.id, 'typeLike')
      },
      TSInterfaceDeclaration(node) {
        check(node.id.name, node.id, 'interface')
      },
      TSEnumDeclaration(node) {
        check(node.id.name, node.id, 'typeLike')
      },
      TSEnumMember(node) {
        const name = getKeyName(node.id)

        if (name !== null) {
          check(name, node.id, 'enumMember')
        }
      },
      PropertyDefinition(node) {
        checkProperty(node, 'classProperty')
      },
      MethodDefinition(node) {
        checkProperty(node, 'classProperty')
      },
      Property(node) {
        checkProperty(node, 'objectLiteralProperty')
      }
    }
  }
}
