function shouldConvert(node) {
  return node.importKind !== 'type'
    && !hasImportAttributes(node)
    && node.specifiers.length > 0
    && node.specifiers.every(specifier => specifier.type === 'ImportSpecifier'
      && specifier.importKind === 'type')
}

function isNamedImport(node) {
  return node.specifiers.length > 0
    && node.specifiers.every(specifier => specifier.type === 'ImportSpecifier')
}

function isTypeImport(node) {
  return node.importKind === 'type'
    || (
      isNamedImport(node)
      && node.specifiers.every(specifier => specifier.importKind === 'type')
    )
}

function hasImportAttributes(node) {
  return (node.attributes?.length ?? 0) > 0
    || (node.assertions?.length ?? 0) > 0
}

function hasCommentsBetween(sourceCode, left, right) {
  return sourceCode.getAllComments().some(comment => comment.range[0] > left.range[1]
    && comment.range[1] < right.range[0])
}

function getLocalName(specifier) {
  return specifier.local?.name ?? null
}

function hasOverlappingLocalNames(left, right) {
  const leftNames = new Set(left.specifiers.map(getLocalName))

  return right.specifiers.some(specifier => leftNames.has(getLocalName(specifier)))
}

function canMerge(sourceCode, typeNode, valueNode) {
  return typeNode.source.value === valueNode.source.value
    && isTypeImport(typeNode)
    && isNamedImport(typeNode)
    && isNamedImport(valueNode)
    && !isTypeImport(valueNode)
    && !hasImportAttributes(typeNode)
    && !hasImportAttributes(valueNode)
    && !hasOverlappingLocalNames(typeNode, valueNode)
    && !hasCommentsBetween(sourceCode, typeNode, valueNode)
}

function getMergePair(imports, sourceCode) {
  for (let index = 1; index < imports.length; index++) {
    const previousImport = imports[index - 1]
    const importNode = imports[index]

    if (canMerge(sourceCode, previousImport, importNode)) {
      return [
        previousImport,
        importNode
      ]
    }
  }

  return null
}

function getConvertNode(imports) {
  return imports.find(shouldConvert)
}

function getTypeSpecifierText(specifier, sourceCode) {
  const text = sourceCode.getText(specifier)

  return text.startsWith('type ')
    ? text
    : `type ${text}`
}

function getLinebreak(text) {
  return text.includes('\r\n') ? '\r\n' : '\n'
}

function getLineIndent(text, index) {
  const lineStart = text.lastIndexOf('\n', index - 1) + 1
  const indentMatch = /^[ \t]*/.exec(text.slice(lineStart, index))

  return indentMatch[0]
}

function getMergedText(typeNode, valueNode, sourceCode) {
  const typeSpecifiers = typeNode.specifiers.map(specifier => getTypeSpecifierText(
    specifier,
    sourceCode
  ))
  const valueSpecifiers = valueNode.specifiers.map(specifier => sourceCode.getText(
    specifier
  ))
  const source = sourceCode.getText(valueNode.source)
  const linebreak = getLinebreak(sourceCode.text)
  const closingIndent = getLineIndent(sourceCode.text, valueNode.range[0])
  const indent = `${closingIndent}  `
  const specifiers = [
    ...typeSpecifiers,
    ...valueSpecifiers
  ]

  return `import {${linebreak}${indent}${specifiers.join(`,${linebreak}${indent}`)}${linebreak}${closingIndent}} from ${source}`
}

function getFixedText(node, sourceCode) {
  return sourceCode.getText(node)
    .replace(/^import\b/, 'import type')
    .replace(/([,{]\s*)type\s+/g, '$1')
}

export default {
  meta: {
    type: 'layout',
    fixable: 'code',
    docs: {
      description: 'Prefer import type and merge duplicate type/value imports.'
    },
    schema: []
  },
  create(context) {
    const sourceCode = context.sourceCode
    const imports = []

    return {
      ImportDeclaration(node) {
        if (typeof node.source.value !== 'string') {
          return
        }

        imports.push(node)
      },
      'Program:exit'() {
        const mergePair = getMergePair(imports, sourceCode)

        if (mergePair) {
          const [
            typeNode,
            valueNode
          ] = mergePair

          context.report({
            node: valueNode.source,
            message: 'Merge type and value imports from the same source.',
            fix: fixer => fixer.replaceTextRange(
              [
                typeNode.range[0],
                valueNode.range[1]
              ],
              getMergedText(typeNode, valueNode, sourceCode)
            )
          })

          return
        }

        const convertNode = getConvertNode(imports)

        if (!convertNode) {
          return
        }

        context.report({
          node: convertNode.source,
          message: 'Use import type when all named imports are type imports.',
          fix: fixer => fixer.replaceTextRange(
            convertNode.range,
            getFixedText(convertNode, sourceCode)
          )
        })
      }
    }
  }
}
