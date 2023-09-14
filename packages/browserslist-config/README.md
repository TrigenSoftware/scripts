# @trigen/browserslist-config

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]

[npm]: https://img.shields.io/npm/v/%40trigen/browserslist-config.svg
[npm-url]: https://www.npmjs.com/package/@trigen/browserslist-config

[node]: https://img.shields.io/node/v/%40trigen/browserslist-config.svg
[node-url]: https://nodejs.org

[size]: https://packagephobia.com/badge?p=@trigen/browserslist-config
[size-url]: https://packagephobia.com/result?p=@trigen/browserslist-config

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/scripts/ci.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/scripts/actions

Trigen's Browserslist config.

## Install

```bash
pnpm add -D @trigen/browserslist-config
# or
yarn add -D @trigen/browserslist-config
# or
npm i -D @trigen/browserslist-config
```

## Configure

Create `.browserslistrc` with next content:

```
extends @trigen/browserslist-config
```

### Other configs

There are other configs for different platforms:

| Config | Description |
|--------|-------------|
| @trigen/browserslist-config/browsers | Only browsers. |
| @trigen/browserslist-config/node | Only NodeJS. |
