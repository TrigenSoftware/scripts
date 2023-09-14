# @trigen/lint-package-json

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]

[npm]: https://img.shields.io/npm/v/%40trigen/lint-package-json.svg
[npm-url]: https://npmjs.com/package/@trigen/lint-package-json

[node]: https://img.shields.io/node/v/%40trigen/lint-package-json.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/@trigen/lint-package-json
[deps-url]: https://libraries.io/npm/@trigen%2Feslint-config/tree

[size]: https://packagephobia.com/badge?p=@trigen/lint-package-json
[size-url]: https://packagephobia.com/result?p=@trigen/lint-package-json

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/scripts/ci.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/scripts/actions

Shortcut to run npm-package-json-lint with @trigen/npm-package-json-lint-config.

## Install

```bash
pnpm add -D @trigen/lint-package-json
# or
yarn add -D @trigen/lint-package-json
# or
npm i -D @trigen/lint-package-json
```

## Usage

```bash
pnpm --package=@trigen/lint-package-json dlx lint-package-json
# or
pnpm --package=@trigen/lint-package-json dlx lint-package-json --monorepo
```
