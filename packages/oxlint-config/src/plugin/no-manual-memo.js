const MEMO_NAMES = new Set([
  'useMemo',
  'useCallback',
  'memo'
])
// Expressions that keep their meaning wherever an expression stands, with no parentheses
const PRIMARY_TYPES = new Set([
  'Identifier',
  'Literal',
  'MemberExpression',
  'CallExpression',
  'NewExpression',
  'ArrayExpression',
  'TemplateLiteral',
  'TaggedTemplateExpression',
  'ThisExpression',
  'ChainExpression',
  'JSXElement',
  'JSXFragment'
])

function getImportedName(specifier) {
  return specifier.imported.name ?? specifier.imported.value
}

function getMessage(name) {
  return `Do not use \`${name}\`: React Compiler memoizes components and hooks.`
}

function getTypeArguments(call) {
  return call.typeArguments ?? call.typeParameters ?? null
}

/**
 * Check if any expression can stand in place of the call without parentheses.
 * @param {object} call - The call that is unwrapped.
 * @returns {boolean} Whether the place takes any expression as it is.
 */
function isBarePlace(call) {
  const { parent } = call

  switch (parent.type) {
    case 'VariableDeclarator':
      return parent.init === call
    case 'AssignmentExpression':
      return parent.right === call
    case 'Property':
      return parent.value === call
    case 'CallExpression':
    case 'NewExpression':
      return parent.arguments.includes(call)
    case 'ReturnStatement':
    case 'ArrayExpression':
    case 'JSXExpressionContainer':
      return true
    default:
      return false
  }
}

/**
 * Get what the call becomes: its function, its component or the value its factory returns.
 * @param {object} call - The memoizing call.
 * @param {string} name - The memoizing function's imported name.
 * @returns {object | null} The expression the call becomes, or null where it cannot be unwrapped.
 */
function getUnwrappedValue(call, name) {
  const [first] = call.arguments

  if (!first || first.type === 'SpreadElement') {
    return null
  }

  if (name === 'memo') {
    return call.arguments.length === 1 && !getTypeArguments(call)
      ? first
      : null
  }

  if (name === 'useCallback') {
    return first
  }

  // A factory of no parameters whose body is an expression, not a block
  return first.type === 'ArrowFunctionExpression'
    && !first.async
    && first.params.length === 0
    && first.body.type !== 'BlockStatement'
    ? first.body
    : null
}

/**
 * Get the edits that unwrap a memoizing call.
 * @param {object} call - The memoizing call.
 * @param {string} name - The memoizing function's imported name.
 * @param {object} sourceCode - The file's source code.
 * @returns {object[] | null} Ranges and their new text, or null where the call cannot be unwrapped.
 */
function getCallEdits(call, name, sourceCode) {
  const value = getUnwrappedValue(call, name)

  if (!value) {
    return null
  }

  const text = sourceCode.getText(value)
  const parenthesized = value.type === 'SequenceExpression'
    || (!PRIMARY_TYPES.has(value.type) && !isBarePlace(call))
  const edits = [
    {
      range: call.range,
      text: parenthesized ? `(${text})` : text
    }
  ]
  const typeArguments = getTypeArguments(call)

  // A hook's type goes to the variable that holds its value
  if (typeArguments && name !== 'memo') {
    const { parent } = call

    if (
      parent.type !== 'VariableDeclarator'
      || parent.id.type !== 'Identifier'
      || parent.id.typeAnnotation
      || typeArguments.params.length !== 1
    ) {
      return null
    }

    edits.push({
      range: [
        parent.id.range[1],
        parent.id.range[1]
      ],
      text: `: ${sourceCode.getText(typeArguments.params[0])}`
    })
  }

  return edits
}

/**
 * Get the edits that remove specifiers from their import, or the import with its line where
 * nothing else is left in it. A run of removed names goes with the separators around it.
 * @param {object[]} removed - The import specifiers to remove.
 * @param {object} declaration - The import declaration.
 * @param {object} sourceCode - The file's source code.
 * @returns {object[]} The ranges to remove.
 */
function getSpecifiersRemoval(removed, declaration, sourceCode) {
  const { specifiers } = declaration
  const named = specifiers.filter(specifier => specifier.type === 'ImportSpecifier')
  const others = specifiers.filter(specifier => specifier.type !== 'ImportSpecifier')

  if (removed.length === specifiers.length) {
    const { text } = sourceCode
    let end = declaration.range[1]

    if (text[end] === '\r') {
      end++
    }

    if (text[end] === '\n') {
      end++
    }

    return [
      {
        range: [
          declaration.range[0],
          end
        ],
        text: ''
      }
    ]
  }

  // The default import stays: the braces go with the names in them
  if (removed.length === named.length) {
    const closingBrace = sourceCode.getTokenAfter(named.at(-1), token => token.value === '}')

    return [
      {
        range: [
          others.at(-1).range[1],
          closingBrace.range[1]
        ],
        text: ''
      }
    ]
  }

  const edits = []
  let run = []

  named.forEach((specifier, index) => {
    if (removed.includes(specifier)) {
      run.push(specifier)
    }

    if (run.length === 0 || (removed.includes(specifier) && index < named.length - 1)) {
      return
    }

    const next = removed.includes(specifier) ? null : specifier
    const previous = named[named.indexOf(run[0]) - 1]

    edits.push({
      range: next
        ? [
          run[0].range[0],
          next.range[0]
        ]
        : [
          previous.range[1],
          run.at(-1).range[1]
        ],
      text: ''
    })
    run = []
  })

  return edits
}

function overlaps(edits) {
  const ranges = edits
    .map(edit => edit.range)
    .sort((left, right) => left[0] - right[0])

  return ranges.some((range, index) => index > 0 && range[0] < ranges[index - 1][1])
}

function toFixes(fixer, edits) {
  return edits.map(edit => fixer.replaceTextRange(edit.range, edit.text))
}

/**
 * Get the edits that unwrap every use of an imported name.
 * @param {object} specifier - The import specifier.
 * @param {string} name - The memoizing function's imported name.
 * @param {object} sourceCode - The file's source code.
 * @returns {object[] | null} The edits, or null where a use cannot be unwrapped.
 */
function getUsageEdits(specifier, name, sourceCode) {
  const [variable] = sourceCode.getDeclaredVariables(specifier)
  const edits = []

  for (const reference of variable?.references ?? []) {
    const { identifier } = reference
    const call = identifier.parent

    if (call?.type !== 'CallExpression' || call.callee !== identifier) {
      return null
    }

    const callEdits = getCallEdits(call, name, sourceCode)

    if (!callEdits) {
      return null
    }

    edits.push(...callEdits)
  }

  return edits
}

export default {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description: 'Disallow `useMemo`, `useCallback` and `memo` where React Compiler memoizes.'
    },
    schema: []
  },
  create(context) {
    const { sourceCode } = context
    // Local names of React's namespace or default import, read as `React.useMemo`
    const reactNames = new Set()

    return {
      ImportDeclaration(node) {
        if (node.source.value !== 'react' || node.importKind === 'type') {
          return
        }

        const memoSpecifiers = []

        node.specifiers.forEach((specifier) => {
          if (specifier.type !== 'ImportSpecifier') {
            reactNames.add(specifier.local.name)
          } else if (specifier.importKind !== 'type' && MEMO_NAMES.has(getImportedName(specifier))) {
            memoSpecifiers.push(specifier)
          }
        })

        // One fix for the whole import: removing names side by side in separate fixes would
        // touch, and the linter applies only one of them in a pass
        const fixable = []
        const edits = []

        memoSpecifiers.forEach((specifier) => {
          const usageEdits = getUsageEdits(specifier, getImportedName(specifier), sourceCode)

          if (usageEdits) {
            fixable.push(specifier)
            edits.push(...usageEdits)
          }
        })

        if (fixable.length > 0) {
          edits.push(...getSpecifiersRemoval(fixable, node, sourceCode))
        }

        const fixed = fixable.length > 0 && !overlaps(edits)

        memoSpecifiers.forEach((specifier) => {
          context.report({
            node: specifier,
            message: getMessage(getImportedName(specifier)),
            ...fixed && specifier === fixable[0] && {
              fix: fixer => toFixes(fixer, edits)
            }
          })
        })
      },
      MemberExpression(node) {
        if (
          node.object.type !== 'Identifier'
          || !reactNames.has(node.object.name)
          || node.computed
          || node.property.type !== 'Identifier'
          || !MEMO_NAMES.has(node.property.name)
        ) {
          return
        }

        const name = node.property.name
        const call = node.parent
        const edits = call?.type === 'CallExpression' && call.callee === node
          ? getCallEdits(call, name, sourceCode)
          : null

        context.report({
          node,
          message: getMessage(name),
          ...edits && {
            fix: fixer => toFixes(fixer, edits)
          }
        })
      }
    }
  }
}
