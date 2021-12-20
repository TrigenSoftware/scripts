# @trigen/scripts-plugin-eslint

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]

[npm]: https://img.shields.io/npm/v/%40trigen/scripts-plugin-eslint.svg
[npm-url]: https://www.npmjs.com/package/@trigen/scripts-plugin-eslint

[node]: https://img.shields.io/node/v/%40trigen/scripts-plugin-eslint.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/@trigen/scripts-plugin-eslint
[deps-url]: https://libraries.io/npm/@trigen%2Fscripts-plugin-eslint/tree

[build]: https://img.shields.io/github/workflow/status/TrigenSoftware/scripts/CI.svg
[build-url]: https://github.com/TrigenSoftware/scripts/actions

ESLint tasks.

## Usage

1. Install package

```bash
yarn add -D @trigen/scripts-plugin-eslint
```

2. Dfine task in `scripts.js` file (or `scripts/index.js`)

```js
import { eslint } from '@trigen/scripts-plugin-eslint'

export default {
  lint: {
    title: 'Lint',
    run: eslint()
  }
}
```

3. Now you can run defined task

```bash
yarn exec -- trigen-scripts lint
```
