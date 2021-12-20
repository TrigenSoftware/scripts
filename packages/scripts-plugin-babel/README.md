# @trigen/scripts-plugin-babel

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]

[npm]: https://img.shields.io/npm/v/%40trigen/scripts-plugin-babel.svg
[npm-url]: https://www.npmjs.com/package/@trigen/scripts-plugin-babel

[node]: https://img.shields.io/node/v/%40trigen/scripts-plugin-babel.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/@trigen/scripts-plugin-babel
[deps-url]: https://libraries.io/npm/@trigen%2Fscripts-plugin-babel/tree

[build]: https://img.shields.io/github/workflow/status/TrigenSoftware/scripts/CI.svg
[build-url]: https://github.com/TrigenSoftware/scripts/actions

Babel tasks.

## Usage

1. Install package

```bash
yarn add -D @trigen/scripts-plugin-babel
```

2. Dfine task in `scripts.js` file (or `scripts/index.js`)

```js
import { babel } from '@trigen/scripts-plugin-babel'

export default {
  build: {
    title: 'Build',
    run: babel({
      input: 'src',
      outDir: 'dist'
    })
  }
}
```

3. Now you can run defined task

```bash
yarn exec -- trigen-scripts build
```
