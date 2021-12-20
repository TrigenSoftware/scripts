# @trigen/scripts

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]

[npm]: https://img.shields.io/npm/v/%40trigen/scripts.svg
[npm-url]: https://www.npmjs.com/package/@trigen/scripts

[node]: https://img.shields.io/node/v/%40trigen/scripts.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/@trigen/scripts
[deps-url]: https://libraries.io/npm/@trigen%2Fscripts/tree

[build]: https://img.shields.io/github/workflow/status/TrigenSoftware/scripts/CI.svg
[build-url]: https://github.com/TrigenSoftware/scripts/actions

Scripts and configs for TrigenSoftware's projects.

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

## Available packages

| Package | Version | Dependencies |
|---------|---------|--------------|
| [`@trigen/babel-preset`](packages/babel-preset#readme) | [![NPM version][babel-preset-npm]][babel-preset-npm-url] | [![Dependencies status][babel-preset-deps]][babel-preset-deps-url] |
| [`@trigen/browserslist-config`](packages/browserslist-config#readme) | [![NPM version][browserslist-config-npm]][browserslist-config-npm-url] | |
| [`@trigen/eslint-config`](packages/eslint-config#readme) | [![NPM version][eslint-config-npm]][eslint-config-npm-url] | [![Dependencies status][eslint-config-deps]][eslint-config-deps-url] |
| [`@trigen/scripts-plugin-babel`](packages/scripts-plugin-babel#readme) | [![NPM version][plugin-babel-npm]][plugin-babel-npm-url] | [![Dependencies status][plugin-babel-deps]][plugin-babel-deps-url] |
| [`@trigen/scripts-plugin-eslint`](packages/scripts-plugin-eslint#readme) | [![NPM version][plugin-eslint-npm]][plugin-eslint-npm-url] | [![Dependencies status][plugin-eslint-deps]][plugin-eslint-deps-url] |
| [`@trigen/scripts-plugin-jest`](packages/scripts-plugin-jest#readme) | [![NPM version][plugin-jest-npm]][plugin-jest-npm-url] | [![Dependencies status][plugin-jest-deps]][plugin-jest-deps-url] |
| [`@trigen/scripts-plugin-rollup`](packages/scripts-plugin-rollup#readme) | [![NPM version][plugin-rollup-npm]][plugin-rollup-npm-url] | [![Dependencies status][plugin-rollup-deps]][plugin-rollup-deps-url] |
| [`@trigen/scripts-plugin-swc`](packages/scripts-plugin-swc#readme) | [![NPM version][plugin-swc-npm]][plugin-swc-npm-url] | [![Dependencies status][plugin-swc-deps]][plugin-swc-deps-url] |
| [`@trigen/scripts-plugin-typescript`](packages/scripts-plugin-typescript#readme) | [![NPM version][plugin-typescript-npm]][plugin-typescript-npm-url] | [![Dependencies status][plugin-typescript-deps]][plugin-typescript-deps-url] |

<!-- babel-preset -->

[babel-preset-npm]: https://img.shields.io/npm/v/%40trigen/babel-preset.svg
[babel-preset-npm-url]: https://www.npmjs.com/package/@trigen/babel-preset

[babel-preset-deps]: https://img.shields.io/librariesio/release/npm/@trigen/babel-preset
[babel-preset-deps-url]: https://libraries.io/npm/@trigen%2Fbabel-preset/tree


<!-- browserslist-config -->

[browserslist-config-npm]: https://img.shields.io/npm/v/%40trigen/browserslist-config.svg
[browserslist-config-npm-url]: https://www.npmjs.com/package/@trigen/browserslist-config

<!-- eslint-config -->

[eslint-config-npm]: https://img.shields.io/npm/v/%40trigen/eslint-config.svg
[eslint-config-npm-url]: https://www.npmjs.com/package/@trigen/eslint-config

[eslint-config-deps]: https://img.shields.io/librariesio/release/npm/@trigen/eslint-config
[eslint-config-deps-url]: https://libraries.io/npm/@trigen%2Feslint-config/tree

<!-- scripts-plugin-babel -->

[plugin-babel-npm]: https://img.shields.io/npm/v/%40trigen/scripts-plugin-babel.svg
[plugin-babel-npm-url]: https://www.npmjs.com/package/@trigen/scripts-plugin-babel

[plugin-babel-deps]: https://img.shields.io/librariesio/release/npm/@trigen/scripts-plugin-babel
[plugin-babel-deps-url]: https://libraries.io/npm/@trigen%2Fscripts-plugin-babel/tree

<!-- scripts-plugin-eslint -->

[plugin-eslint-npm]: https://img.shields.io/npm/v/%40trigen/scripts-plugin-eslint.svg
[plugin-eslint-npm-url]: https://www.npmjs.com/package/@trigen/scripts-plugin-eslint

[plugin-eslint-deps]: https://img.shields.io/librariesio/release/npm/@trigen/scripts-plugin-eslint
[plugin-eslint-deps-url]: https://libraries.io/npm/@trigen%2Fscripts-plugin-eslint/tree

<!-- bscripts-plugin-jest -->

[plugin-jest-npm]: https://img.shields.io/npm/v/%40trigen/scripts-plugin-jest.svg
[plugin-jest-npm-url]: https://www.npmjs.com/package/@trigen/scripts-plugin-jest

[plugin-jest-deps]: https://img.shields.io/librariesio/release/npm/@trigen/scripts-plugin-jest
[plugin-jest-deps-url]: https://libraries.io/npm/@trigen%2Fscripts-plugin-jest/tree

<!-- scripts-plugin-rollup -->

[plugin-rollup-npm]: https://img.shields.io/npm/v/%40trigen/scripts-plugin-rollup.svg
[plugin-rollup-npm-url]: https://www.npmjs.com/package/@trigen/scripts-plugin-rollup

[plugin-rollup-deps]: https://img.shields.io/librariesio/release/npm/@trigen/scripts-plugin-rollup
[plugin-rollup-deps-url]: https://libraries.io/npm/@trigen%2Fscripts-plugin-rollup/tree

<!-- scripts-plugin-swc -->

[plugin-swc-npm]: https://img.shields.io/npm/v/%40trigen/scripts-plugin-swc.svg
[plugin-swc-npm-url]: https://www.npmjs.com/package/@trigen/scripts-plugin-swc

[plugin-swc-deps]: https://img.shields.io/librariesio/release/npm/@trigen/scripts-plugin-swc
[plugin-swc-deps-url]: https://libraries.io/npm/@trigen%2Fscripts-plugin-swc/tree

<!-- scripts-plugin-typescript -->

[plugin-typescript-npm]: https://img.shields.io/npm/v/%40trigen/scripts-plugin-typescript.svg
[plugin-typescript-npm-url]: https://www.npmjs.com/package/@trigen/scripts-plugin-typescript

[plugin-typescript-deps]: https://img.shields.io/librariesio/release/npm/@trigen/scripts-plugin-typescript
[plugin-typescript-deps-url]: https://libraries.io/npm/@trigen%2Fscripts-plugin-typescript/tree
