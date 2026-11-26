// A component is a function named in PascalCase, as JSX can only call one so
const COMPONENT_NAME_PATTERN = /^[A-Z]/

function propertyName(property) {
  if (property.type !== 'Property' || property.computed) {
    return null
  }

  return property.key.type === 'Identifier'
    ? property.key.name
    : property.key.value
}

function attributeName(attribute) {
  return attribute.type === 'JSXAttribute' && attribute.name.type === 'JSXIdentifier'
    ? attribute.name.name
    : null
}

function propsPattern(fn) {
  const [first] = fn.params

  if (first?.type === 'ObjectPattern') {
    return first
  }

  return first?.type === 'AssignmentPattern' && first.left.type === 'ObjectPattern'
    ? first.left
    : null
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce `ref` and `className` first and `children` last among a component\'s props, and `key`, `ref` and `className` first among an element\'s attributes.'
    },
    schema: []
  },
  create(context) {
    const checkProps = (pattern) => {
      const properties = pattern.properties.filter(property => property.type === 'Property')
      const names = properties.map(propertyName)
      const ref = names.indexOf('ref')
      const className = names.indexOf('className')
      const children = names.indexOf('children')

      if (ref > 0) {
        context.report({
          node: properties[ref],
          message: '`ref` opens a component\'s props.'
        })
      }

      if (className >= 0 && className !== (ref === 0 ? 1 : 0)) {
        context.report({
          node: properties[className],
          message: '`className` comes first among a component\'s props, after `ref`.'
        })
      }

      if (children >= 0 && children !== properties.length - 1) {
        context.report({
          node: properties[children],
          message: '`children` closes a component\'s props, right before the rest.'
        })
      }
    }
    const checkComponent = (fn, name) => {
      const pattern = name && COMPONENT_NAME_PATTERN.test(name) ? propsPattern(fn) : null

      if (pattern) {
        checkProps(pattern)
      }
    }

    return {
      FunctionDeclaration(node) {
        checkComponent(node, node.id?.name)
      },
      VariableDeclarator(node) {
        if (
          node.id.type === 'Identifier'
          && (node.init?.type === 'ArrowFunctionExpression' || node.init?.type === 'FunctionExpression')
        ) {
          checkComponent(node.init, node.id.name)
        }
      },
      JSXOpeningElement(node) {
        const { attributes } = node
        // Where the next of `key`, `ref` and `className` stands: they lead the attributes in that order
        let next = 0

        attributes.forEach((attribute, index) => {
          const name = attributeName(attribute)

          if (name === 'key') {
            if (index !== 0) {
              context.report({
                node: attribute,
                message: '`key` opens an element\'s attributes.'
              })
            }

            next = index + 1
          } else if (name === 'ref') {
            // A ref the component owns stands right after the spread a passed one comes in
            const owned = attributes[index - 1]?.type === 'JSXSpreadAttribute'

            if (owned) {
              return
            }

            if (index !== next) {
              context.report({
                node: attribute,
                message: '`ref` opens an element\'s attributes after `key`, or the attributes a component owns right after a spread.'
              })
            }

            next = index + 1
          } else if (name === 'className' && index !== next) {
            context.report({
              node: attribute,
              message: '`className` comes first among an element\'s attributes, after `key` and `ref`.'
            })
          }
        })
      }
    }
  }
}
