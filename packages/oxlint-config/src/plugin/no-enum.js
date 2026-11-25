export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow a TypeScript `enum`, which compiles to an object a bundler cannot drop.'
    },
    schema: []
  },
  create(context) {
    return {
      TSEnumDeclaration(node) {
        // A `const enum` is `oxc/no-const-enum`'s
        if (node.const) {
          return
        }

        context.report({
          node: node.id,
          message: 'Do not use `enum`: it compiles to an object a bundler cannot drop. Use constants or a union of literals.'
        })
      }
    }
  }
}
