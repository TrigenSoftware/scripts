# @trigen/babel-preset

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Peer dependencies status][peer-deps]][peer-deps-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]

[npm]: https://img.shields.io/npm/v/%40trigen/babel-preset.svg
[npm-url]: https://npmjs.com/package/@trigen/babel-preset

[node]: https://img.shields.io/node/v/%40trigen/babel-preset.svg
[node-url]: https://nodejs.org

[peer-deps]: https://david-dm.org/TrigenSoftware/scripts/peer-status.svg?path=packages/babel-preset
[peer-deps-url]: https://david-dm.org/TrigenSoftware/scripts?type=peer&path=packages/babel-preset

[deps]: https://img.shields.io/librariesio/release/npm/@trigen/babel-preset
[deps-url]: https://libraries.io/npm/@trigen%2Fbabel-preset/tree

[build]: https://img.shields.io/github/workflow/status/TrigenSoftware/scripts/CI.svg
[build-url]: https://github.com/TrigenSoftware/scripts/actions

Trigen's Babel preset.

## Install

```bash
yarn add -D @trigen/babel-preset
# or
npm i -D @trigen/babel-preset
```

## Configure

Add `@trigen/babel-preset` to your presets in `.babelrc`.

## Options

| Option | Default value for `app` env | `lib` env | `jest` env |
|------|-----------------------------|-----------|------------|
| targets | `false` | `false` | `{ node: 'current' }` |
| useBuiltIns | `'usage'` | — | — |
| corejs | `3` | — | — |
| commonjs | `false` | `false` | `true` |
| typescript | `false` | — | — |
| react | `false` | — | — |
| transformDynamicImport | `false` | `false` | `true` |
| transformRuntime | `false` | `true` | `false` |
| requireContextHook | `false` | `false` | `true` |
| [`reactConstantElements`](https://babeljs.io/docs/en/next/babel-plugin-transform-react-constant-elements.html#options) | — | — | — |
| [`reactRemovePropTypes`](https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types#options) | — | `{ mode: 'unsafe-wrap' }` | — |
