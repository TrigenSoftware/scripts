# @trigen/scripts-plugin-jest

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]

[npm]: https://img.shields.io/npm/v/%40trigen/scripts-plugin-jest.svg
[npm-url]: https://www.npmjs.com/package/@trigen/scripts-plugin-jest

[node]: https://img.shields.io/node/v/%40trigen/scripts-plugin-jest.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/TrigenSoftware/scripts.svg?path=packages/scripts-plugin-jest
[deps-url]: https://david-dm.org/TrigenSoftware/scripts?path=packages/scripts-plugin-jest

[build]: https://img.shields.io/github/workflow/status/TrigenSoftware/scripts/CI.svg
[build-url]: https://github.com/TrigenSoftware/scripts/actions

Jest tasks.

## Usage

1. Install package

```bash
yarn add -D @trigen/scripts-plugin-jest
```

2. Dfine task in `scripts.js` file (or `scripts/index.js`)

```js
import { jest } from '@trigen/scripts-plugin-jest'

export default {
  jest: {
    title: 'Jest',
    run: jest()
  }
}
```

3. Now you can run defined task

```bash
yarn exec -- trigen-scripts jest
```
