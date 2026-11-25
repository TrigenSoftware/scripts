import {
  basename,
  dirname,
  extname,
  isAbsolute,
  relative,
  resolve,
  sep
} from 'node:path'
import { ResolverFactory } from 'oxc-resolver'

// The layers of Flat Layers Design and what each one may import beside itself
const ALLOWED_LAYERS = {
  shared: [],
  services: ['shared'],
  stores: ['services', 'shared'],
  uikit: ['assets', 'shared'],
  blocks: [
    'uikit',
    'stores',
    'services',
    'shared',
    'assets'
  ],
  pages: [
    'blocks',
    'uikit',
    'stores',
    'services',
    'shared',
    'assets'
  ]
}
// What a layer may import as types alone
const TYPE_LAYERS = {
  uikit: ['services']
}
const LAYERS = new Set([...Object.keys(ALLOWED_LAYERS), 'assets'])
// Entry points of a module that are imported by their path, never through its index
const ENTRY_PATTERN = /^(?:skeleton|loadable)\.[cm]?[jt]sx?$|\.module\.css$|\.mock\.[cm]?[jt]sx?$/
const INDEX_PATTERN = /^index\.[cm]?[jt]sx?$/
const JSX_PATTERN = /\.[jt]sx$/
const HOOKS_PATTERN = /^hooks\.[cm]?[jt]s$/
const HOOK_NAME_PATTERN = /^use[A-Z\d]/
const STORE_PATTERN = /^[^.]+\.[cm]?[jt]s$/
const STORIES_PATTERN = /\.stories\.[cm]?[jt]sx?$/
// The first segment of a story's title, named after its layer
const LAYER_TITLES = {
  uikit: 'UIKit',
  blocks: 'Blocks',
  pages: 'Pages'
}
let resolver

function getResolver() {
  resolver ??= new ResolverFactory({
    tsconfig: 'auto',
    extensions: [
      '.ts',
      '.tsx',
      '.mts',
      '.js',
      '.jsx',
      '.mjs',
      '.json'
    ],
    conditionNames: ['import', 'default']
  })

  return resolver
}

/**
 * Find where a file stands in the layers.
 * @param {string} root - The absolute folder of the layers.
 * @param {string} path - The file's absolute path.
 * @returns {object | null} Its layer, its module folder and its path in that folder, or null outside the layers.
 */
function locate(root, path) {
  const fromRoot = relative(root, path)

  if (!fromRoot || fromRoot.startsWith('..') || isAbsolute(fromRoot)) {
    return null
  }

  const segments = fromRoot.split(sep)
  const [layer] = segments

  if (!LAYERS.has(layer)) {
    return null
  }

  return {
    layer,
    // A folder of its own, as a component's or a domain's, but not the layer's `shared/`
    module: segments.length > 2 && segments[1] !== 'shared'
      ? segments[1]
      : null,
    inModule: segments.slice(2).join('/')
  }
}

function isTypeOnly(node) {
  return node.importKind === 'type'
    || node.exportKind === 'type'
    || (
      node.specifiers?.length > 0
      && node.specifiers.every(specifier => specifier.importKind === 'type' || specifier.exportKind === 'type')
    )
}

function isHookFile(filename) {
  return JSX_PATTERN.test(filename)
    || HOOKS_PATTERN.test(basename(filename))
    || filename.split(sep).includes('hooks')
}

// A declaration at the top of the module, exported or not
function isModuleLevel(node) {
  const { parent } = node

  return parent?.type === 'Program'
    || (
      (parent?.type === 'ExportNamedDeclaration' || parent?.type === 'ExportDefaultDeclaration')
      && parent.parent?.type === 'Program'
    )
}

function unwrapExpression(node) {
  return node?.type === 'TSSatisfiesExpression' || node?.type === 'TSAsExpression'
    ? unwrapExpression(node.expression)
    : node
}

function getTitle(object) {
  const title = object?.type === 'ObjectExpression'
    ? object.properties.find(property => property.type === 'Property' && !property.computed && property.key.name === 'title')
    : null

  return title?.value.type === 'Literal' && typeof title.value.value === 'string'
    ? title.value
    : null
}

function getHookName(node) {
  if (node.type === 'FunctionDeclaration') {
    return node.id?.name ?? null
  }

  if (
    node.type === 'VariableDeclarator'
    && node.id.type === 'Identifier'
    && (node.init?.type === 'ArrowFunctionExpression' || node.init?.type === 'FunctionExpression')
  ) {
    return node.id.name
  }

  return null
}

/**
 * Check one import of a file against the layers.
 * @param {object} importer - Where the importing file stands.
 * @param {object} target - Where the imported file stands.
 * @param {object} details - The import's specifier, the importing file and whether it imports types alone.
 * @returns {string | null} The problem, or null where the import is right.
 */
function checkImport(importer, target, details) {
  const {
    specifier,
    filename,
    typeOnly,
    reexport
  } = details
  const relativeSpecifier = specifier.startsWith('.')
  const sameModule = importer.layer === target.layer && importer.module === target.module
  const targetName = basename(target.inModule)

  if (importer.layer === target.layer) {
    if (!relativeSpecifier) {
      return 'Import from the same layer by a relative path.'
    }
  } else {
    const typeLayers = TYPE_LAYERS[importer.layer] ?? []
    const allowed = ALLOWED_LAYERS[importer.layer]?.includes(target.layer)
      || (typeOnly && typeLayers.includes(target.layer))

    if (!allowed) {
      return typeLayers.includes(target.layer)
        ? `${importer.layer} imports only types from ${target.layer}.`
        : `${importer.layer} does not import from ${target.layer}.`
    }

    if (relativeSpecifier) {
      return 'Import from another layer by its alias, not by a relative path.'
    }
  }

  if (reexport && ENTRY_PATTERN.test(targetName) && INDEX_PATTERN.test(basename(filename))) {
    return 'An index does not re-export an entry point imported by its path, such as a skeleton, a loadable or a mock.'
  }

  if (
    target.module
    && !sameModule
    && target.layer !== 'assets'
    && !INDEX_PATTERN.test(target.inModule)
    && !ENTRY_PATTERN.test(targetName)
  ) {
    return `Import from ${target.module} through its index: only entry points such as its skeleton or loadable are imported by their path.`
  }

  return null
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Keep the layers of Flat Layers Design: what each layer imports, how, and where hooks live.'
    },
    schema: [
      {
        type: 'object',
        properties: {
          root: {
            type: 'string'
          }
        },
        additionalProperties: false
      }
    ]
  },
  create(context) {
    const { filename } = context
    const root = resolve(context.cwd, context.options[0]?.root ?? 'app')
    const importer = locate(root, filename)
    const hookFile = isHookFile(filename) || filename.endsWith('.d.ts')
    const checkSource = (node, sourceNode, reexport) => {
      const specifier = sourceNode?.value

      if (!importer || typeof specifier !== 'string') {
        return
      }

      const resolved = getResolver().resolveFileSync(filename, specifier)
      const target = resolved.path ? locate(root, resolved.path) : null

      if (!target) {
        return
      }

      const problem = checkImport(importer, target, {
        specifier,
        filename,
        typeOnly: isTypeOnly(node),
        reexport
      })

      if (problem) {
        context.report({
          node: sourceNode,
          message: problem
        })
        return
      }

      // A store base imports none of its subdomains, `plant.ts` none of `plant.list.ts`
      const importerName = basename(filename)
      const targetName = basename(resolved.path)

      if (
        importer.layer === 'stores'
        && target.layer === 'stores'
        && STORE_PATTERN.test(importerName)
        && targetName.startsWith(`${importerName.slice(0, -extname(importerName).length)}.`)
        && dirname(filename) === dirname(resolved.path)
      ) {
        context.report({
          node: sourceNode,
          message: 'A store base imports none of its subdomains.'
        })
      }

      // The kit's shared code is its own
      if (
        importer.layer !== 'uikit'
        && target.layer === 'uikit'
        && relative(root, resolved.path).split(sep)[1] === 'shared'
      ) {
        context.report({
          node: sourceNode,
          message: 'uikit/shared is the kit\'s own: only uikit imports it.'
        })
      }
    }
    // A story's title starts with its layer and its folder, or, at the layer's root, its file
    const expectedTitle = importer && LAYER_TITLES[importer.layer] && STORIES_PATTERN.test(filename)
      ? `${LAYER_TITLES[importer.layer]}/${importer.module ?? basename(filename).replace(STORIES_PATTERN, '')}`
      : null
    const objects = new Map()
    let meta = null
    const checkHook = (node) => {
      const name = getHookName(node)

      if (!hookFile && name && HOOK_NAME_PATTERN.test(name)) {
        context.report({
          node: node.id,
          message: 'Declare a hook in a .jsx or .tsx file, a hooks file or a hooks folder, where the rules of hooks find it.'
        })
      }
    }

    return {
      ImportDeclaration(node) {
        checkSource(node, node.source, false)
      },
      ExportNamedDeclaration(node) {
        if (node.source) {
          checkSource(node, node.source, true)
        }
      },
      ExportAllDeclaration(node) {
        checkSource(node, node.source, true)
      },
      ImportExpression(node) {
        if (node.source.type === 'Literal') {
          checkSource(node, node.source, false)
        }
      },
      FunctionDeclaration(node) {
        if (isModuleLevel(node)) {
          checkHook(node)
        }
      },
      VariableDeclarator(node) {
        if (isModuleLevel(node.parent)) {
          checkHook(node)

          if (node.id.type === 'Identifier') {
            objects.set(node.id.name, unwrapExpression(node.init))
          }
        }
      },
      ExportDefaultDeclaration(node) {
        meta = unwrapExpression(node.declaration)
      },
      'Program:exit'() {
        const title = expectedTitle && getTitle(meta?.type === 'Identifier' ? objects.get(meta.name) : meta)

        if (title && title.value !== expectedTitle && !title.value.startsWith(`${expectedTitle}/`)) {
          context.report({
            node: title,
            message: `A story's title starts with its layer and its folder: "${expectedTitle}".`
          })
        }
      }
    }
  }
}
