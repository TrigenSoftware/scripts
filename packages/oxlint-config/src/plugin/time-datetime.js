export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require `dateTime` on a `<time>` element.'
    },
    schema: []
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (
          node.name.type !== 'JSXIdentifier'
          || node.name.name !== 'time'
          || node.attributes.some(attribute => attribute.type === 'JSXSpreadAttribute' || attribute.name?.name === 'dateTime')
        ) {
          return
        }

        context.report({
          node,
          message: 'Give `<time>` its `dateTime`, the value machines read.'
        })
      }
    }
  }
}
