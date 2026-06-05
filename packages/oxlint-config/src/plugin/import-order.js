import { builtinModules } from 'node:module'

const builtinModuleNames = new Set(
  builtinModules.flatMap(moduleName => [
    moduleName,
    moduleName.replace(/^node:/, '')
  ])
)
const defaultGroups = [
  'builtin',
  'external',
  'internal',
  'parent',
  'sibling',
  'index'
]
const defaultOptions = {
  'groups': defaultGroups,
  'pathGroups': [],
  'newlines-between': 'ignore',
  'typeImports': 'none'
}

function isBuiltin(source) {
  return source.startsWith('node:')
    || builtinModuleNames.has(source.split('/')[0])
}

function isExternal(source) {
  return !source.startsWith('.')
    && !source.startsWith('/')
    && !source.startsWith('~')
    && !source.startsWith('#')
    && !source.startsWith('@/')
}

function isIndex(source) {
  return source === '.'
    || source === './'
    || source === './index'
    || source.startsWith('./index.')
}

function getGroup(source) {
  if (isBuiltin(source)) {
    return 'builtin'
  }

  if (isExternal(source)) {
    return 'external'
  }

  if (source.startsWith('../')) {
    return 'parent'
  }

  if (isIndex(source)) {
    return 'index'
  }

  if (source.startsWith('./')) {
    return 'sibling'
  }

  return 'internal'
}

function matchesPathGroup(source, pattern) {
  if (pattern === '~/**') {
    return source.startsWith('~/')
  }

  if (pattern === '#*/**') {
    return /^#[^/]+\/.+/.test(source)
  }

  if (pattern === '@/**') {
    return source.startsWith('@/') || source === '@'
  }

  return false
}

function getPathGroup(source, pathGroups) {
  return pathGroups.find(({ pattern }) => matchesPathGroup(source, pattern))
}

function isTypeImport(node) {
  return node.importKind === 'type'
    || (
      node.specifiers.length > 0
      && node.specifiers.every(specifier => specifier.importKind === 'type')
    )
}

function getTypeRank(node, options) {
  if (options.typeImports === 'first') {
    return isTypeImport(node) ? 0 : 1
  }

  if (options.typeImports === 'last') {
    return isTypeImport(node) ? 1 : 0
  }

  return 0
}

function getImportKind(node) {
  return isTypeImport(node) ? 'type' : 'value'
}

function getRank(node, options) {
  const source = node.source.value
  const pathGroup = getPathGroup(source, options.pathGroups)
  const group = pathGroup?.group ?? getGroup(source)
  const groupIndex = options.groups.indexOf(group)
  const positionRank = pathGroup?.position === 'before'
    ? 0
    : pathGroup?.position === 'after'
      ? 2
      : 1

  return {
    group,
    groupIndex: groupIndex === -1 ? Number.POSITIVE_INFINITY : groupIndex,
    positionRank,
    importKind: getImportKind(node),
    typeRank: getTypeRank(node, options)
  }
}

function compareRanks(left, right) {
  return left.groupIndex - right.groupIndex
    || left.positionRank - right.positionRank
    || left.typeRank - right.typeRank
}

function getLinebreak(text) {
  return text.includes('\r\n') ? '\r\n' : '\n'
}

function getMessage(left, right) {
  if (
    left.groupIndex === right.groupIndex
    && left.positionRank === right.positionRank
    && left.typeRank !== right.typeRank
  ) {
    return `Expected ${right.importKind} import to come before ${left.importKind} import.`
  }

  return `Expected ${right.group} import to come before ${left.group} import.`
}

function getOptions(context) {
  return {
    ...defaultOptions,
    ...context.options[0],
    groups: context.options[0]?.groups ?? defaultGroups,
    pathGroups: context.options[0]?.pathGroups ?? []
  }
}

function getImportItems(imports, options) {
  return imports
    .filter(node => node.specifiers.length > 0)
    .map((node, index) => ({
      index,
      node,
      rank: getRank(node, options)
    }))
}

function compareImportItems(left, right) {
  return compareRanks(left.rank, right.rank)
    || left.index - right.index
}

function getFirstUnorderedPair(items) {
  for (let index = 1; index < items.length; index++) {
    const previousItem = items[index - 1]
    const item = items[index]

    if (compareRanks(previousItem.rank, item.rank) > 0) {
      return [
        previousItem,
        item
      ]
    }
  }

  return null
}

function hasBlankLineBetween(sourceCode, left, right) {
  return sourceCode.text
    .slice(left.node.range[1], right.node.range[0])
    .split(/\r?\n/)
    .slice(1, -1)
    .some(line => line.trim() === '')
}

function getInvalidNewlinePair(sourceCode, items, options) {
  if (options['newlines-between'] === 'ignore') {
    return null
  }

  for (let index = 1; index < items.length; index++) {
    const previousItem = items[index - 1]
    const item = items[index]
    const hasBlankLine = hasBlankLineBetween(sourceCode, previousItem, item)
    const invalid = options['newlines-between'] === 'never'
      ? hasBlankLine
      : !hasBlankLine

    if (invalid) {
      return [
        previousItem,
        item
      ]
    }
  }

  return null
}

function hasInnerComments(sourceCode, items) {
  const firstNode = items[0].node
  const lastNode = items.at(-1).node

  return sourceCode.getAllComments().some(comment => comment.range[0] > firstNode.range[0]
    && comment.range[1] < lastNode.range[1])
}

function canFix(sourceCode, items) {
  return !hasInnerComments(sourceCode, items)
}

function hasSkippedImportsBetween(imports, items) {
  const itemNodes = new Set(items.map(({ node }) => node))
  const [
    start,
    end
  ] = getImportBlockRange(items)

  return imports.some(node => !itemNodes.has(node)
    && node.range[0] > start
    && node.range[1] < end)
}

function getFixedImportText(sourceCode, items, options) {
  const linebreak = getLinebreak(sourceCode.text)
  const separator = options['newlines-between'] === 'always'
    ? `${linebreak}${linebreak}`
    : linebreak

  return [...items]
    .sort(compareImportItems)
    .map(({ node }) => sourceCode.getText(node))
    .join(separator)
}

function getImportBlockRange(items) {
  return [
    items[0].node.range[0],
    items.at(-1).node.range[1]
  ]
}

export default {
  meta: {
    type: 'layout',
    fixable: 'code',
    docs: {
      description: 'Enforce import order by configured groups.'
    },
    schema: [
      {
        type: 'object',
        properties: {
          'groups': {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          'pathGroups': {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                pattern: {
                  type: 'string'
                },
                group: {
                  type: 'string'
                },
                position: {
                  enum: [
                    'before',
                    'after'
                  ]
                }
              },
              required: ['pattern', 'group'],
              additionalProperties: true
            }
          },
          'newlines-between': {
            enum: [
              'ignore',
              'always',
              'never'
            ]
          },
          'typeImports': {
            enum: [
              'first',
              'last',
              'none'
            ]
          }
        },
        additionalProperties: true
      }
    ]
  },
  create(context) {
    const options = getOptions(context)
    const imports = []

    return {
      ImportDeclaration(node) {
        const source = node.source.value

        if (typeof source !== 'string') {
          return
        }

        imports.push(node)
      },
      'Program:exit'() {
        if (imports.length < 2) {
          return
        }

        const sourceCode = context.sourceCode
        const items = getImportItems(imports, options)

        if (items.length < 2) {
          return
        }

        const unorderedPair = getFirstUnorderedPair(items)
        const invalidNewlinePair = getInvalidNewlinePair(sourceCode, items, options)

        if (!unorderedPair && !invalidNewlinePair) {
          return
        }

        const fix = canFix(sourceCode, items)
          && !hasSkippedImportsBetween(imports, items)
          ? fixer => fixer.replaceTextRange(
            getImportBlockRange(items),
            getFixedImportText(sourceCode, items, options)
          )
          : null
        const [
          previousItem,
          item
        ] = unorderedPair ?? invalidNewlinePair

        context.report({
          node: item.node,
          message: unorderedPair
            ? getMessage(previousItem.rank, item.rank)
            : 'Import declarations have invalid empty lines.',
          fix
        })
      }
    }
  }
}
