# @trigen/scripts

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]
[![Dependabot badge][dependabot]][dependabot-url]

[npm]: https://img.shields.io/npm/v/%40trigen/scripts.svg
[npm-url]: https://www.npmjs.com/package/@trigen/scripts

[node]: https://img.shields.io/node/v/%40trigen/scripts.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/TrigenSoftware/scripts.svg?path=packages/scripts
[deps-url]: https://david-dm.org/TrigenSoftware/scripts?path=packages/scripts

[build]: http://img.shields.io/travis/com/TrigenSoftware/scripts/master.svg
[build-url]: https://travis-ci.com/TrigenSoftware/scripts

[dependabot]: https://api.dependabot.com/badges/status?host=github&repo=TrigenSoftware/scripts
[dependabot-url]: https://dependabot.com/

Scripts and configuration for TrigenSoftware's projects.

## Usage

1. Install scripts package

```bash
yarn add -D @trigen/scripts
```

2. Install any plugin package

```bash
yarn add -D @trigen/scripts-preset-react-app
```

3. Add installed plugin to `.trigenscriptsrc`

```json
[
    "preset-react-app",
    "./some/other",
    ["some-other", {
        "withOption": true
    }]
]
```

4. Now you can run some script

```bash
yarn exec -- trigen-scripts lint
```

## Available plugins and presets

| Package | Version | Dependencies |
|---------|---------|--------------|
| [`@trigen/browserslist-config`](packages/browserslist-config#readme) | [![NPM version][browserslist-config-npm]][browserslist-config-npm-url] | |
| [`@trigen/babel-preset`](packages/babel-preset#readme) | [![NPM version][babel-preset-npm]][babel-preset-npm-url] | [![Dependencies status][babel-preset-deps]][babel-preset-deps-url] |
| [`@trigen/eslint-config`](packages/eslint-config#readme) | [![NPM version][eslint-config-npm]][eslint-config-npm-url] | [![Dependencies status][eslint-config-deps]][eslint-config-deps-url] |
| [`@trigen/scripts-plugin-eslint`](packages/scripts-plugin-eslint#readme) | [![NPM version][plugin-eslint-npm]][plugin-eslint-npm-url] | [![Dependencies status][plugin-eslint-deps]][plugin-eslint-deps-url] |
| [`@trigen/scripts-plugin-babel`](packages/scripts-plugin-babel#readme) | [![NPM version][plugin-babel-npm]][plugin-babel-npm-url] | [![Dependencies status][plugin-babel-deps]][plugin-babel-deps-url] |
| [`@trigen/scripts-plugin-typescript`](packages/scripts-plugin-typescript#readme) | [![NPM version][plugin-typescript-npm]][plugin-typescript-npm-url] | [![Dependencies status][plugin-typescript-deps]][plugin-typescript-deps-url] |
| [`@trigen/scripts-plugin-jest`](packages/scripts-plugin-jest#readme) | [![NPM version][plugin-jest-npm]][plugin-jest-npm-url] | [![Dependencies status][plugin-jest-deps]][plugin-jest-deps-url] |
| [`@trigen/scripts-plugin-rollup`](packages/scripts-plugin-rollup#readme) | [![NPM version][plugin-rollup-npm]][plugin-rollup-npm-url] | [![Dependencies status][plugin-rollup-deps]][plugin-rollup-deps-url] |
| [`@trigen/scripts-plugin-size-limit`](packages/scripts-plugin-size-limit#readme) | [![NPM version][plugin-size-limit-npm]][plugin-size-limit-npm-url] | [![Dependencies status][plugin-size-limit-deps]][plugin-size-limit-deps-url] |
| [`@trigen/scripts-plugin-storybook`](packages/scripts-plugin-storybook#readme) | [![NPM version][plugin-storybook-npm]][plugin-storybook-npm-url] | [![Dependencies status][plugin-storybook-deps]][plugin-storybook-deps-url] |
| [`@trigen/scripts-preset-lib`](packages/scripts-preset-lib#readme) | [![NPM version][preset-lib-npm]][preset-lib-npm-url] | [![Dependencies status][preset-lib-deps]][preset-lib-deps-url] |
| [`@trigen/scripts-preset-node-app`](packages/scripts-preset-node-app#readme) | [![NPM version][preset-node-app-npm]][preset-node-app-npm-url] | [![Dependencies status][preset-node-app-deps]][preset-node-app-deps-url] |
| [`@trigen/scripts-preset-react-app`](packages/scripts-preset-react-app#readme) | [![NPM version][preset-react-app-npm]][preset-react-app-npm-url] | [![Dependencies status][preset-react-app-deps]][preset-react-app-deps-url] |

[browserslist-config-npm]: https://img.shields.io/npm/v/%40trigen/browserslist-config.svg
[browserslist-config-npm-url]: https://www.npmjs.com/package/@trigen/browserslist-config

[babel-preset-npm]: https://img.shields.io/npm/v/%40trigen/babel-preset.svg
[babel-preset-npm-url]: https://www.npmjs.com/package/@trigen/babel-preset

[babel-preset-deps]: https://david-dm.org/TrigenSoftware/scripts.svg?path=packages/babel-preset
[babel-preset-deps-url]: https://david-dm.org/TrigenSoftware/scripts?path=packages/babel-preset

[eslint-config-npm]: https://img.shields.io/npm/v/%40trigen/eslint-config.svg
[eslint-config-npm-url]: https://www.npmjs.com/package/@trigen/eslint-config

[eslint-config-deps]: https://david-dm.org/TrigenSoftware/scripts.svg?path=packages/eslint-config
[eslint-config-deps-url]: https://david-dm.org/TrigenSoftware/scripts?path=packages/eslint-config

[plugin-eslint-npm]: https://img.shields.io/npm/v/%40trigen/scripts-plugin-eslint.svg
[plugin-eslint-npm-url]: https://www.npmjs.com/package/@trigen/scripts-plugin-eslint

[plugin-eslint-deps]: https://david-dm.org/TrigenSoftware/scripts.svg?path=packages/scripts-plugin-eslint
[plugin-eslint-deps-url]: https://david-dm.org/TrigenSoftware/scripts?path=packages/scripts-plugin-eslint

[plugin-babel-npm]: https://img.shields.io/npm/v/%40trigen/scripts-plugin-babel.svg
[plugin-babel-npm-url]: https://www.npmjs.com/package/@trigen/scripts-plugin-babel

[plugin-babel-deps]: https://david-dm.org/TrigenSoftware/scripts.svg?path=packages/scripts-plugin-babel
[plugin-babel-deps-url]: https://david-dm.org/TrigenSoftware/scripts?path=packages/scripts-plugin-babel

[plugin-typescript-npm]: https://img.shields.io/npm/v/%40trigen/scripts-plugin-typescript.svg
[plugin-typescript-npm-url]: https://www.npmjs.com/package/@trigen/scripts-plugin-typescript

[plugin-typescript-deps]: https://david-dm.org/TrigenSoftware/scripts.svg?path=packages/scripts-plugin-typescript
[plugin-typescript-deps-url]: https://david-dm.org/TrigenSoftware/scripts?path=packages/scripts-plugin-typescript

[plugin-jest-npm]: https://img.shields.io/npm/v/%40trigen/scripts-plugin-jest.svg
[plugin-jest-npm-url]: https://www.npmjs.com/package/@trigen/scripts-plugin-jest

[plugin-jest-deps]: https://david-dm.org/TrigenSoftware/scripts.svg?path=packages/scripts-plugin-jest
[plugin-jest-deps-url]: https://david-dm.org/TrigenSoftware/scripts?path=packages/scripts-plugin-jest

[plugin-rollup-npm]: https://img.shields.io/npm/v/%40trigen/scripts-plugin-rollup.svg
[plugin-rollup-npm-url]: https://www.npmjs.com/package/@trigen/scripts-plugin-rollup

[plugin-rollup-deps]: https://david-dm.org/TrigenSoftware/scripts.svg?path=packages/scripts-plugin-rollup
[plugin-rollup-deps-url]: https://david-dm.org/TrigenSoftware/scripts?path=packages/scripts-plugin-rollup

[plugin-size-limit-npm]: https://img.shields.io/npm/v/%40trigen/scripts-plugin-size-limit.svg
[plugin-size-limit-npm-url]: https://www.npmjs.com/package/@trigen/scripts-plugin-size-limit

[plugin-size-limit-deps]: https://david-dm.org/TrigenSoftware/scripts.svg?path=packages/scripts-plugin-size-limit
[plugin-size-limit-deps-url]: https://david-dm.org/TrigenSoftware/scripts?path=packages/scripts-plugin-size-limit

[plugin-storybook-npm]: https://img.shields.io/npm/v/%40trigen/scripts-plugin-storybook.svg
[plugin-storybook-npm-url]: https://www.npmjs.com/package/@trigen/scripts-plugin-storybook

[plugin-storybook-deps]: https://david-dm.org/TrigenSoftware/scripts.svg?path=packages/scripts-plugin-storybook
[plugin-storybook-deps-url]: https://david-dm.org/TrigenSoftware/scripts?path=packages/scripts-plugin-storybook

[preset-lib-npm]: https://img.shields.io/npm/v/%40trigen/scripts-preset-lib.svg
[preset-lib-npm-url]: https://www.npmjs.com/package/@trigen/scripts-preset-lib

[preset-lib-deps]: https://david-dm.org/TrigenSoftware/scripts.svg?path=packages/scripts-preset-lib
[preset-lib-deps-url]: https://david-dm.org/TrigenSoftware/scripts?path=packages/scripts-preset-lib

[preset-node-app-npm]: https://img.shields.io/npm/v/%40trigen/scripts-preset-node-app.svg
[preset-node-app-npm-url]: https://www.npmjs.com/package/@trigen/scripts-preset-node-app

[preset-node-app-deps]: https://david-dm.org/TrigenSoftware/scripts.svg?path=packages/scripts-preset-node-app
[preset-node-app-deps-url]: https://david-dm.org/TrigenSoftware/scripts?path=packages/scripts-preset-node-app

[preset-react-app-npm]: https://img.shields.io/npm/v/%40trigen/scripts-preset-react-app.svg
[preset-react-app-npm-url]: https://www.npmjs.com/package/@trigen/scripts-preset-react-app

[preset-react-app-deps]: https://david-dm.org/TrigenSoftware/scripts.svg?path=packages/scripts-preset-react-app
[preset-react-app-deps-url]: https://david-dm.org/TrigenSoftware/scripts?path=packages/scripts-preset-react-app

## Roadmap

- [ ] Move to [`webpack-chain`](https://github.com/neutrinojs/webpack-chain)
