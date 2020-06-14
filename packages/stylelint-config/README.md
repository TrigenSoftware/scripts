# @trigen/stylelint-config

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Peer dependencies status][peer-deps]][peer-deps-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]
[![Dependabot badge][dependabot]][dependabot-url]

[npm]: https://img.shields.io/npm/v/%40trigen/stylelint-config.svg
[npm-url]: https://npmjs.com/package/@trigen/stylelint-config

[node]: https://img.shields.io/node/v/%40trigen/stylelint-config.svg
[node-url]: https://nodejs.org

[peer-deps]: https://david-dm.org/TrigenSoftware/scripts/peer-status.svg?path=packages/stylelint-config
[peer-deps-url]: https://david-dm.org/TrigenSoftware/scripts?type=peer&path=packages/stylelint-config

[deps]: https://david-dm.org/TrigenSoftware/scripts.svg?path=packages/stylelint-config
[deps-url]: https://david-dm.org/TrigenSoftware/scripts?path=packages/stylelint-config

[build]: http://img.shields.io/travis/com/TrigenSoftware/scripts.svg
[build-url]: https://travis-ci.com/TrigenSoftware/scripts

[dependabot]: https://api.dependabot.com/badges/status?host=github&repo=TrigenSoftware/scripts
[dependabot-url]: https://dependabot.com/

Trigen's Stylelint config

## Install

```bash
npm i -D @trigen/stylelint-config
#or
yarn add -D @trigen/stylelint-config
```

## Configure

Create `.stylelintrc` with next content:

```json
{
    "extends": "@trigen/stylelint-config"
}
```

### Other configs

There are other configs for different syntax:

| Config | Description |
|--------|-------------|
| @trigen/stylelint-config/css | Rules for CSS code. |
| @trigen/stylelint-config/scss | Rules for SCSS code. |
| @trigen/stylelint-config/stylable | Rules for Stylable code. |

Example:

```json
{
    "extends": [
        "@trigen/stylelint-config"
        "@trigen/stylelint-config/scss"
    ]
}
```
