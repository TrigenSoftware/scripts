# @trigen/scripts

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]

[npm]: https://img.shields.io/npm/v/%40trigen/scripts.svg
[npm-url]: https://www.npmjs.com/package/@trigen/scripts

[node]: https://img.shields.io/node/v/%40trigen/scripts.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/@trigen/scripts
[deps-url]: https://libraries.io/npm/@trigen%2Fscripts/tree

[size]: https://packagephobia.com/badge?p=@trigen/scripts
[size-url]: https://packagephobia.com/result?p=@trigen/scripts

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/scripts/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/scripts/actions

CLI tool for running scripts.

## Usage

### Install

```bash
pnpm add -D @trigen/scripts
```

### `run`

Using `run` you can run scripts from package.json serial:

```bash
pnpm exec -- run lint:code lint:styles
```

or parallel:

```bash
pnpm exec -- run --parallel lint:code lint:styles
# also available -p alias for --parallel option
```

also you can pass arguments to scripts:

```bash
pnpm exec -- run [ lint:code --fix ] [ lint:styles --fix ]
```
