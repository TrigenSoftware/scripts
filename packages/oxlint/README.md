# @trigen/oxlint

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]

[npm]: https://img.shields.io/npm/v/%40trigen/oxlint.svg
[npm-url]: https://npmjs.com/package/@trigen/oxlint

[node]: https://img.shields.io/node/v/%40trigen/oxlint.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/@trigen/oxlint
[deps-url]: https://libraries.io/npm/@trigen%2Foxlint

[size]: https://packagephobia.com/badge?p=@trigen/oxlint
[size-url]: https://packagephobia.com/result?p=@trigen/oxlint

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/scripts/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/scripts/actions

Trigen's Oxlint config helper.

## Install

```bash
pnpm add -D @trigen/oxlint
# or
yarn add -D @trigen/oxlint
# or
npm i -D @trigen/oxlint
```

## Configure

Use `defineConfig` in `oxlint.config.ts`:

```ts
import { defineConfig } from '@trigen/oxlint'
import baseConfig from '@trigen/oxlint-config'
import testConfig from '@trigen/oxlint-config/test'

export default defineConfig({
  ignorePatterns: ['**/package/'],
  extends: [
    baseConfig,
    testConfig
  ],
  env: {
    node: true
  },
  rules: {
    'eslint/no-console': 'off'
  }
})
```

`defineConfig` fixes inheritance problems in Oxlint's default config behavior.
