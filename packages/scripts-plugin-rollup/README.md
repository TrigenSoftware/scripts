# @trigen/scripts-plugin-rollup

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]

[npm]: https://img.shields.io/npm/v/%40trigen/scripts-plugin-rollup.svg
[npm-url]: https://www.npmjs.com/package/@trigen/scripts-plugin-rollup

[node]: https://img.shields.io/node/v/%40trigen/scripts-plugin-rollup.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/@trigen/scripts-plugin-rollup
[deps-url]: https://libraries.io/npm/@trigen%2Fscripts-plugin-rollup/tree

[build]: https://img.shields.io/github/workflow/status/TrigenSoftware/scripts/CI.svg
[build-url]: https://github.com/TrigenSoftware/scripts/actions

Rollup tasks.

## Usage

1. Install package

```bash
yarn add -D @trigen/scripts-plugin-rollup
```

2. Dfine task in `scripts.js` file (or `scripts/index.js`)

```js
import { rollup } from '@trigen/scripts-plugin-rollup'

export default {
  rollup: {
    title: 'Rollup',
    run: rollup()
  }
}
```

3. Now you can run defined task

```bash
yarn exec -- trigen-scripts rollup
```
