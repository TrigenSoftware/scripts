# @trigen/scripts-plugin-swc

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]

[npm]: https://img.shields.io/npm/v/%40trigen/scripts-plugin-swc.svg
[npm-url]: https://www.npmjs.com/package/@trigen/scripts-plugin-swc

[node]: https://img.shields.io/node/v/%40trigen/scripts-plugin-swc.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/@trigen/scripts-plugin-swc
[deps-url]: https://libraries.io/npm/@trigen%2Fscripts-plugin-swc/tree

[build]: https://img.shields.io/github/workflow/status/TrigenSoftware/scripts/CI.svg
[build-url]: https://github.com/TrigenSoftware/scripts/actions

SWC tasks.

## Usage

1. Install package

```bash
yarn add -D @trigen/scripts-plugin-swc
```

2. Dfine task in `scripts.js` file (or `scripts/index.js`)

```js
import { swc } from '@trigen/scripts-plugin-swc'

export default {
  build: {
    title: 'Build',
    run: swc({
      input: 'src',
      outDur: 'dist'
    })
  }
}
```

3. Now you can run defined task

```bash
yarn exec -- trigen-scripts build
```
