# @trigen/npm-package-json-lint-config

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]

[npm]: https://img.shields.io/npm/v/%40trigen/npm-package-json-lint-config.svg
[npm-url]: https://npmjs.com/package/@trigen/npm-package-json-lint-config

[node]: https://img.shields.io/node/v/%40trigen/npm-package-json-lint-config.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/@trigen/npm-package-json-lint-config
[deps-url]: https://libraries.io/npm/@trigen%2Feslint-config/tree

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/scripts/ci.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/scripts/actions

Trigen's npm-package-json-lint config.

## Install

```bash
pnpm add -D @trigen/npm-package-json-lint-config
# or
yarn add -D @trigen/npm-package-json-lint-config
# or
npm i -D @trigen/npm-package-json-lint-config
```

## Configure

Create `.npmpackagejsonlintrc.json` with next content:

```json
{
  "extends": "@trigen/npm-package-json-lint-config"
}
```

for monorepos:

```json
{
  "extends": [
    "@trigen/npm-package-json-lint-config",
    "@trigen/npm-package-json-lint-config/monorepo"
  ]
}
```
