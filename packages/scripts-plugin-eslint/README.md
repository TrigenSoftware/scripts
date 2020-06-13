# @trigen/scripts-plugin-eslint

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]
[![Dependabot badge][dependabot]][dependabot-url]

[npm]: https://img.shields.io/npm/v/%40trigen/scripts-plugin-eslint.svg
[npm-url]: https://www.npmjs.com/package/@trigen/scripts-plugin-eslint

[node]: https://img.shields.io/node/v/%40trigen/scripts-plugin-eslint.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/TrigenSoftware/scripts.svg?path=packages/scripts-plugin-eslint
[deps-url]: https://david-dm.org/TrigenSoftware/scripts?path=packages/scripts-plugin-eslint

[build]: http://img.shields.io/travis/com/TrigenSoftware/scripts.svg
[build-url]: https://travis-ci.com/TrigenSoftware/scripts

[dependabot]: https://api.dependabot.com/badges/status?host=github&repo=TrigenSoftware/scripts
[dependabot-url]: https://dependabot.com/

ESLint scripts.

## Usage

1. Install scripts package

```bash
yarn add -D @trigen/scripts-plugin-eslint
```

2. Add installed scripts to `.trigenscriptsrc`

```json
[
    "plugin-eslint",
    "./some/other"
]
```

3. Now you can run some script

```bash
yarn exec -- trigen-scripts lint:scripts
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| lint | `string` | `'src/**/*.{js,jsx,ts,tsx}'` | Files patterns to lint |

## Available scripts

```bash
# Lint only scripts
yarn lint:scripts
# Lint all sources
yarn lint
# Run lint
yarn test
```
