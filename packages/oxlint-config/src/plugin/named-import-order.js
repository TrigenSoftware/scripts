const defaultOptions = {
  typeImports: 'none',
  patterns: []
}

function getOptions(context) {
  return {
    ...defaultOptions,
    ...context.options[0],
    patterns: context.options[0]?.patterns ?? []
  }
}

function getName(specifier) {
  const imported = specifier.imported ?? specifier.local

  if (imported.type === 'Identifier') {
    return imported.name
  }

  return String(imported.value)
}

function isTypeSpecifier(node, specifier) {
  return node.importKind === 'type'
    || specifier.importKind === 'type'
}

function getTypeRank(node, specifier, options) {
  if (options.typeImports === 'first') {
    return isTypeSpecifier(node, specifier) ? 0 : 1
  }

  if (options.typeImports === 'last') {
    return isTypeSpecifier(node, specifier) ? 1 : 0
  }

  return 0
}

function getPatternRank(name, patterns) {
  const normalizedName = name.replace(/^\$+|\$+$/g, '')
  const rank = patterns.findIndex(pattern => new RegExp(pattern).test(
    normalizedName
  ))

  return rank === -1 ? Number.POSITIVE_INFINITY : rank
}

function getRank(node, specifier, options) {
  const name = getName(specifier)

  return {
    name,
    typeRank: getTypeRank(node, specifier, options),
    patternRank: getPatternRank(name, options.patterns)
  }
}

function compareRanks(left, right) {
  return left.typeRank - right.typeRank
    || left.patternRank - right.patternRank
}

function getItems(node, options) {
  return node.specifiers
    .filter(specifier => specifier.type === 'ImportSpecifier')
    .map((specifier, index) => ({
      index,
      specifier,
      rank: getRank(node, specifier, options)
    }))
}

function compareItems(left, right) {
  return compareRanks(left.rank, right.rank)
    || left.index - right.index
}

function getFirstUnorderedPair(items) {
  for (let index = 1; index < items.length; index++) {
    const previousItem = items[index - 1]
    const item = items[index]

    if (compareItems(previousItem, item) > 0) {
      return [
        previousItem,
        item
      ]
    }
  }

  return null
}

function getLinebreak(text) {
  return text.includes('\r\n') ? '\r\n' : '\n'
}

function getLineIndent(text, index) {
  const lineStart = text.lastIndexOf('\n', index - 1) + 1
  const indentMatch = /^[ \t]*/.exec(text.slice(lineStart, index))

  return indentMatch[0]
}

function getBracesRange(node, items, sourceCode) {
  const text = sourceCode.text
  const firstSpecifier = items[0].specifier
  const lastSpecifier = items.at(-1).specifier
  const openingBrace = text.lastIndexOf('{', firstSpecifier.range[0])
  const closingBrace = text.indexOf('}', lastSpecifier.range[1])
  const searchEnd = node.source?.range?.[0] ?? node.range[1]

  if (
    openingBrace < node.range[0]
    || closingBrace === -1
    || closingBrace > searchEnd
  ) {
    return null
  }

  return [
    openingBrace + 1,
    closingBrace
  ]
}

function hasInnerComments(sourceCode, range) {
  return sourceCode.getAllComments().some(comment => comment.range[0] > range[0]
    && comment.range[1] < range[1])
}

function shouldBeMultiline(sourceCode, range, items) {
  return items.length > 1
    && !sourceCode.text.slice(range[0], range[1]).includes('\n')
}

function getFixedText(node, items, options, sourceCode, range) {
  const text = sourceCode.text
  const content = text.slice(range[0], range[1])
  const sortedSpecifiers = [...items]
    .sort(compareItems)
    .map(({ specifier }) => sourceCode.getText(specifier))

  if (!content.includes('\n') && items.length < 2) {
    return ` ${sortedSpecifiers.join(', ')} `
  }

  const linebreak = getLinebreak(text)
  const firstSpecifier = items[0].specifier
  const closingIndent = getLineIndent(text, node.range[0])
  const indent = content.includes('\n')
    ? getLineIndent(text, firstSpecifier.range[0])
    : `${closingIndent}  `

  return `${linebreak}${indent}${sortedSpecifiers.join(`,${linebreak}${indent}`)}${linebreak}${closingIndent}`
}

function getMessage(left, right) {
  if (left.rank.typeRank !== right.rank.typeRank) {
    return `Expected ${right.rank.name} to come before ${left.rank.name} because of import kind.`
  }

  if (left.rank.patternRank !== right.rank.patternRank) {
    return `Expected ${right.rank.name} to come before ${left.rank.name} because of naming pattern.`
  }

  return `Expected ${right.rank.name} to come before ${left.rank.name}.`
}

export default {
  meta: {
    type: 'layout',
    fixable: 'code',
    docs: {
      description: 'Enforce named import specifier order.'
    },
    schema: [
      {
        type: 'object',
        properties: {
          typeImports: {
            enum: [
              'first',
              'last',
              'none'
            ]
          },
          patterns: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        },
        additionalProperties: true
      }
    ]
  },
  create(context) {
    const options = getOptions(context)

    return {
      ImportDeclaration(node) {
        const items = getItems(node, options)

        if (items.length < 2) {
          return
        }

        const unorderedPair = getFirstUnorderedPair(items)
        const sourceCode = context.sourceCode
        const range = getBracesRange(node, items, sourceCode)
        const invalidMultiline = range && shouldBeMultiline(
          sourceCode,
          range,
          items
        )

        if (!unorderedPair && !invalidMultiline) {
          return
        }

        const fix = range && !hasInnerComments(sourceCode, range)
          ? fixer => fixer.replaceTextRange(
            range,
            getFixedText(node, items, options, sourceCode, range)
          )
          : null
        const [
          previousItem,
          item
        ] = unorderedPair ?? [
          items[0],
          items[1]
        ]

        context.report({
          node: item.specifier,
          message: unorderedPair
            ? getMessage(previousItem, item)
            : 'Expected named imports to be multiline.',
          fix
        })
      }
    }
  }
}
