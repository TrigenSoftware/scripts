# @trigen/scripts

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]

[npm]: https://img.shields.io/npm/v/%40trigen/scripts.svg
[npm-url]: https://www.npmjs.com/package/@trigen/scripts

[node]: https://img.shields.io/node/v/%40trigen/scripts.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/TrigenSoftware/scripts.svg?path=packages/scripts
[deps-url]: https://david-dm.org/TrigenSoftware/scripts?path=packages/scripts

[build]: https://img.shields.io/github/workflow/status/TrigenSoftware/scripts/CI.svg
[build-url]: https://github.com/TrigenSoftware/scripts/actions

CLI tool for running scripts.

## Usage

1. Install `scripts` package

```bash
yarn add -D @trigen/scripts
```

2. Install any plugin package

```bash
yarn add -D @trigen/scripts-plugin-jest @trigen/scripts-plugin-eslint
```

3. Create `scripts.js` file (or `scripts/index.js`) and define tasks

```js
import { rm } from '@trigen/scripts'
import { jest } from '@trigen/scripts-plugin-jest'
import { eslint } from '@trigen/scripts-plugin-eslint'

export default {
  lint: {
    title: 'Lint',
    run: eslint()
  },
  jest: {
    title: 'Jest',
    run: jest()
  },
  test: {
    title: 'Test',
    run: ['lint', 'jest'],
    parallel: true
  },
  clean: {
    title: 'Clean',
    run: rm([
      './coverage',
      './node_modules/.cache'
    ])
  }
}
```

4. Now you can run one of defined task

```bash
yarn exec -- trigen-scripts test
```
