# @trigen/eslint-config

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Peer dependencies status][peer-deps]][peer-deps-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]
[![Dependabot badge][dependabot]][dependabot-url]

[npm]: https://img.shields.io/npm/v/%40trigen/eslint-config.svg
[npm-url]: https://npmjs.com/package/@trigen/eslint-config

[node]: https://img.shields.io/node/v/%40trigen/eslint-config.svg
[node-url]: https://nodejs.org

[peer-deps]: https://david-dm.org/TrigenSoftware/scripts/peer-status.svg?path=packages/eslint-config
[peer-deps-url]: https://david-dm.org/TrigenSoftware/scripts?type=peer&path=packages/eslint-config

[deps]: https://david-dm.org/TrigenSoftware/scripts.svg?path=packages/eslint-config
[deps-url]: https://david-dm.org/TrigenSoftware/scripts?path=packages/eslint-config

[build]: http://img.shields.io/travis/com/TrigenSoftware/scripts.svg
[build-url]: https://travis-ci.com/TrigenSoftware/scripts

[dependabot]: https://api.dependabot.com/badges/status?host=github&repo=TrigenSoftware/scripts
[dependabot-url]: https://dependabot.com/

Trigen's ESLint config.

## Install

```bash
npm i -D @trigen/eslint-config
# or
yarn add -D @trigen/eslint-config
```

## Configure

Create `.eslintrc` with next content:

```json
{
    "extends": "@trigen/eslint-config"
}
```

### Additional configs

There are additional configs for specific language features:

| Config | Description |
|--------|-------------|
| @trigen/eslint-config/react | Rules for ReactJS code. |
| @trigen/eslint-config/commonjs | Rules for CommonJS code. |
| @trigen/eslint-config/jest | Rules for Jest code. |
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
