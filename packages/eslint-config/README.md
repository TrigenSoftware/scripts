# @trigen/eslint-config

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]

[npm]: https://img.shields.io/npm/v/%40trigen/eslint-config.svg
[npm-url]: https://npmjs.com/package/@trigen/eslint-config

[node]: https://img.shields.io/node/v/%40trigen/eslint-config.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/@trigen/eslint-config
[deps-url]: https://libraries.io/npm/@trigen%2Feslint-config/tree

[build]: https://img.shields.io/github/workflow/status/TrigenSoftware/scripts/CI.svg
[build-url]: https://github.com/TrigenSoftware/scripts/actions

Trigen's ESLint config.

## Install

```bash
pnpm add -D @trigen/eslint-config
# or
yarn add -D @trigen/eslint-config
# or
npm i -D @trigen/eslint-config
```

## Configure

Create `.eslintrc.json` with next content:

```json
{
  "extends": "@trigen/eslint-config"
}
```

### Additional configs

There are additional configs for specific language features:

| Config | Description |
|--------|-------------|
| @trigen/eslint-config/commonjs | Rules for CommonJS modules. |
| @trigen/eslint-config/esm | Rules for ES modules. |
| @trigen/eslint-config/react | Rules for ReactJS code. |
| @trigen/eslint-config/jest | Rules for Jest tests. |
| @trigen/eslint-config/storybook | Rules for Storybook's stories. |
| @trigen/eslint-config/typescript | Rules for TypeScript code. |
| @trigen/eslint-config/typescript-requiring-type-checking | Rules for TypeScript code with type checking. |

Example:

```json
{
  "extends": [
    "@trigen/eslint-config",
    "@trigen/eslint-config/react",
    "@trigen/eslint-config/typescript",
    "@trigen/eslint-config/typescript-requiring-type-checking"
  ]
}
```
