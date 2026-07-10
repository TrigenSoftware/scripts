function isFunctionExpression(node) {
  return node?.type === 'ArrowFunctionExpression'
    || node?.type === 'FunctionExpression'
}

function pushComputedKeys(stack, classBody) {
  classBody.body.forEach((member) => {
    if (member.computed) {
      stack.push(member.key)
    }
  })
}

function pushChildren(stack, node) {
  Object.entries(node).forEach(([key, value]) => {
    if (key === 'parent' || typeof value !== 'object' || value === null) {
      return
    }

    if (Array.isArray(value)) {
      value.forEach(item => stack.push(item))
    } else {
      stack.push(value)
    }
  })
}

/**
 * Check if a function references `this`, `arguments` or `new.target` from its own scope,
 * so it can't be converted to an arrow function.
 * @param {object} functionNode
 * @returns {boolean} Whether the function uses its own bindings.
 */
function usesFunctionBindings(functionNode) {
  const stack = [...functionNode.params, functionNode.body]

  while (stack.length > 0) {
    const node = stack.pop()

    if (!node || typeof node.type !== 'string') {
      continue
    }

    switch (node.type) {
      case 'ThisExpression':
        return true
      case 'MetaProperty':
        if (node.meta.name === 'new') {
          return true
        }

        continue
      case 'Identifier':
        if (node.name === 'arguments') {
          return true
        }

        continue
      // nested regular functions and class members rebind `this` and `arguments`
      case 'FunctionDeclaration':
      case 'FunctionExpression':
        continue
      case 'ClassBody':
        pushComputedKeys(stack, node)
        continue
      case 'MemberExpression':
        stack.push(node.object)

        if (node.computed) {
          stack.push(node.property)
        }

        continue
      case 'Property':
      case 'PropertyDefinition':
      case 'MethodDefinition':
        if (node.computed) {
          stack.push(node.key)
        }

        stack.push(node.value)
        continue
      default:
        pushChildren(stack, node)
    }
  }

  return false
}

function checkDeclarator(context, declarator) {
  if (
    isFunctionExpression(declarator.init)
    && declarator.id.type === 'Identifier'
    && !declarator.id.typeAnnotation
  ) {
    context.report({
      node: declarator.id,
      message: 'Use a function declaration instead of assigning a function to a constant at the top level.'
    })
  }
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce function declarations at the top level and arrow functions assigned to constants inside functions.'
    },
    schema: []
  },
  create(context) {
    let depth = 0

    return {
      FunctionDeclaration(node) {
        if (depth > 0 && !node.generator && !usesFunctionBindings(node)) {
          context.report({
            node: node.id ?? node,
            message: 'Use an arrow function assigned to a constant instead of a nested function declaration.'
          })
        }

        depth++
      },
      'FunctionDeclaration:exit'() {
        depth--
      },
      FunctionExpression() {
        depth++
      },
      'FunctionExpression:exit'() {
        depth--
      },
      ArrowFunctionExpression() {
        depth++
      },
      'ArrowFunctionExpression:exit'() {
        depth--
      },
      StaticBlock() {
        depth++
      },
      'StaticBlock:exit'() {
        depth--
      },
      VariableDeclaration(node) {
        if (depth === 0 && node.kind === 'const') {
          node.declarations.forEach(declarator => checkDeclarator(context, declarator))
        }
      }
    }
  }
}
