function isSuspense(name) {
  return (name.type === 'JSXIdentifier' && name.name === 'Suspense')
    || (name.type === 'JSXMemberExpression' && name.property.name === 'Suspense')
}

function isEmpty(value) {
  const expression = value?.type === 'JSXExpressionContainer' ? value.expression : null

  return (expression?.type === 'Literal' && expression.value === null)
    || (expression?.type === 'Identifier' && expression.name === 'undefined')
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require `Suspense` to draw the shape of what is coming in its `fallback`.'
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (!isSuspense(node.name) || node.attributes.some(attribute => attribute.type === 'JSXSpreadAttribute')) {
          return
        }

        const fallback = node.attributes.find(attribute => attribute.name?.name === 'fallback')

        if (!fallback || isEmpty(fallback.value)) {
          context.report({
            node: fallback ?? node,
            message: 'Give `Suspense` the skeleton of what is coming as its `fallback`: an empty one leaves a hole that fills in late.'
          })
        }
      }
    }
  }
}
