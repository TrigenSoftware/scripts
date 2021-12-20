# @trigen/scripts-plugin-typescript

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]

[npm]: https://img.shields.io/npm/v/%40trigen/scripts-plugin-typescript.svg
[npm-url]: https://www.npmjs.com/package/@trigen/scripts-plugin-typescript

[node]: https://img.shields.io/node/v/%40trigen/scripts-plugin-typescript.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/@trigen/scripts-plugin-typescript
[deps-url]: https://libraries.io/npm/@trigen%2Fscripts-plugin-typescript/tree

[build]: https://img.shields.io/github/workflow/status/TrigenSoftware/scripts/CI.svg
[build-url]: https://github.com/TrigenSoftware/scripts/actions

TypeScript tasls.

## Usage

1. Install package

```bash
yarn add -D @trigen/scripts-plugin-typescript
```

2. Dfine task in `scripts.js` file (or `scripts/index.js`)

```js
import {
  check,
  emitDeclarations,
  node,
  typedoc
} from '@trigen/scripts-plugin-typescript'

export default {
  typecheck: {
    title: 'Typecheck',
    run: check()
  },
  emitDeclarations: {
    title: 'Emit declarations',
    run: emitDeclarations()
  },
  node: {
    title: 'Node.js with TypeScript',
    run: node()
  },
  buildDocs: {
    title: 'Build docs',
    run: typedoc({
      input: 'src'
    })
  }
}
```

3. Now you can run defined task

```bash
yarn exec -- trigen-scripts typecheck
yarn exec -- trigen-scripts emitDeclarations
yarn exec -- trigen-scripts node
yarn exec -- trigen-scripts buildDocs
```
