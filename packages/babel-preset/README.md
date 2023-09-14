# @trigen/babel-preset

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]

[npm]: https://img.shields.io/npm/v/%40trigen/babel-preset.svg
[npm-url]: https://npmjs.com/package/@trigen/babel-preset

[node]: https://img.shields.io/node/v/%40trigen/babel-preset.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/@trigen/babel-preset
[deps-url]: https://libraries.io/npm/@trigen%2Fbabel-preset/tree

[size]: https://packagephobia.com/badge?p=@trigen/babel-preset
[size-url]: https://packagephobia.com/result?p=@trigen/babel-preset

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/scripts/ci.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/scripts/actions

Trigen's Babel preset.

## Install

```bash
pnpm add -D @trigen/babel-preset
# or
yarn add -D @trigen/babel-preset
# or
npm i -D @trigen/babel-preset
```

## Configure

Add `@trigen/babel-preset` to your presets in `.babelrc.json`.

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
