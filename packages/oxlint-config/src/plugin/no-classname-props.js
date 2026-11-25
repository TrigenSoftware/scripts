// A class prop for a part, such as `titleClassName`: `className` itself is the root's
const PART_CLASS_NAME_PATTERN = /^[a-z][a-zA-Z\d]*ClassName$/

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow a class prop for an inner part, such as `titleClassName`.'
    },
    schema: []
  },
  create(context) {
    return {
      JSXAttribute(node) {
        const name = node.name.type === 'JSXIdentifier' ? node.name.name : null

        if (name && PART_CLASS_NAME_PATTERN.test(name)) {
          context.report({
            node: node.name,
            message: `Make the part a component of its own with its own \`className\` instead of \`${name}\`.`
          })
        }
      }
    }
  }
}
