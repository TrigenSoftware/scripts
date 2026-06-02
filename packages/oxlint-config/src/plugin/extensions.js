import { posix as path } from 'node:path'

function getOptions(context) {
  return {
    ignorePackages: context.options[0] === 'ignorePackages'
  }
}

function isPackageImport(source) {
  return !source.startsWith('.')
    && !source.startsWith('/')
}

function hasExtension(source) {
  const cleanSource = source.split(/[?#]/)[0]
  const basename = path.basename(cleanSource)

  return path.extname(basename) !== ''
}

function checkSource(context, options, node) {
  const source = node.source?.value

  if (typeof source !== 'string') {
    return
  }

  if (options.ignorePackages && isPackageImport(source)) {
    return
  }

  if (hasExtension(source)) {
    return
  }

  context.report({
    node: node.source,
    message: `Missing file extension for "${source}".`
  })
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require import and export paths to include any file extension.'
    },
    schema: [
      {
        enum: [
          'always',
          'ignorePackages'
        ]
      }
    ]
  },
  create(context) {
    const options = getOptions(context)

    return {
      ExportAllDeclaration(node) {
        checkSource(context, options, node)
      },
      ExportNamedDeclaration(node) {
        checkSource(context, options, node)
      },
      ImportDeclaration(node) {
        checkSource(context, options, node)
      }
    }
  }
}
