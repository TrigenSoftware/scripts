# @trigen/scripts-plugin-typescript

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]
[![Dependabot badge][dependabot]][dependabot-url]

[npm]: https://img.shields.io/npm/v/%40trigen/scripts-plugin-typescript.svg
[npm-url]: https://www.npmjs.com/package/@trigen/scripts-plugin-typescript

[node]: https://img.shields.io/node/v/%40trigen/scripts-plugin-typescript.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/TrigenSoftware/scripts.svg?path=packages/scripts-plugin-typescript
[deps-url]: https://david-dm.org/TrigenSoftware/scripts?path=packages/scripts-plugin-typescript

[build]: http://img.shields.io/travis/com/TrigenSoftware/scripts.svg
[build-url]: https://travis-ci.com/TrigenSoftware/scripts

[dependabot]: https://api.dependabot.com/badges/status?host=github&repo=TrigenSoftware/scripts
[dependabot-url]: https://dependabot.com/

TypeScript scripts.

## Usage

1. Install scripts package

```bash
yarn add -D @trigen/scripts-plugin-typescript
```

2. Add installed scripts to `.trigenscriptsrc`

```json
[
    "plugin-typescript",
    "./some/other"
]
```

3. Now you can run some script

```bash
yarn exec -- trigen-scripts start src/test.ts
```

## Available scripts

```bash
# Run type checking
yarn typecheck
# Run type checking and lint
yarn test
# Generate docs for typescript sources
yarn build:docs
# Start given script
yarn start
# Build sources
yarn build
```
