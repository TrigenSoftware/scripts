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
| [`@trigen/scripts`](packages/scripts#readme) | [![NPM version][npm]][npm-url] | [![Dependencies status][deps]][deps-url] |
| [`@trigen/babel-preset`](packages/babel-preset#readme) | [![NPM version][babel-preset-npm]][babel-preset-npm-url] | [![Dependencies status][babel-preset-deps]][babel-preset-deps-url] |
| [`@trigen/browserslist-config`](packages/browserslist-config#readme) | [![NPM version][browserslist-config-npm]][browserslist-config-npm-url] | |
| [`@trigen/eslint-config`](packages/eslint-config#readme) | [![NPM version][eslint-config-npm]][eslint-config-npm-url] | [![Dependencies status][eslint-config-deps]][eslint-config-deps-url] |

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
