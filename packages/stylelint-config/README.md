# @trigen/stylelint-config

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]

[npm]: https://img.shields.io/npm/v/%40trigen/stylelint-config.svg
[npm-url]: https://www.npmjs.com/package/@trigen/stylelint-config

[node]: https://img.shields.io/node/v/%40trigen/stylelint-config.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/@trigen/stylelint-config
[deps-url]: https://libraries.io/npm/@trigen%2Fstylelint-config/tree

[size]: https://packagephobia.com/badge?p=@trigen/stylelint-config
[size-url]: https://packagephobia.com/result?p=@trigen/stylelint-config

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/scripts/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/scripts/actions

Trigen's Stylelint config.

## Install

```bash
pnpm add -D @trigen/stylelint-config
# or
yarn add -D @trigen/stylelint-config
# or
npm i -D @trigen/stylelint-config
```

## Configure

Create `stylelint.config.js` with next content:

```js
export default {
  extends: ['@trigen/stylelint-config']
}
```

### Additional configs

There are additional configs for specific language features and strict mode:

| Config | Description |
|--------|-------------|
| @trigen/stylelint-config/scss | Rules for SCSS code. |
| @trigen/stylelint-config/logical | Rules with CSS logical properties support. |
| @trigen/stylelint-config/strict | Strict rules for enhanced code quality. |

Example:

`stylelint.config.js`:

```js
export default {
  extends: [
    '@trigen/stylelint-config',
    '@trigen/stylelint-config/scss',
    '@trigen/stylelint-config/logical'
  ]
}
```
