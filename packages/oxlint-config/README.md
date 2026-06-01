# @trigen/oxlint-config

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]

[npm]: https://img.shields.io/npm/v/%40trigen/oxlint-config.svg
[npm-url]: https://npmjs.com/package/@trigen/oxlint-config

[node]: https://img.shields.io/node/v/%40trigen/oxlint-config.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/@trigen/oxlint-config
[deps-url]: https://libraries.io/npm/@trigen%2Foxlint-config

[size]: https://packagephobia.com/badge?p=@trigen/oxlint-config
[size-url]: https://packagephobia.com/result?p=@trigen/oxlint-config

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/scripts/tests.yml?branch=main
[build-url]: https://github.com/TrigenSoftware/scripts/actions

Trigen's Oxlint config.

## Install

```bash
pnpm add -D oxlint @trigen/oxlint-config
# or
yarn add -D oxlint @trigen/oxlint-config
# or
npm i -D oxlint @trigen/oxlint-config
```

## Configure

Create `oxlint.config.ts` with next content:

```ts
import baseConfig from '@trigen/oxlint-config'

export default baseConfig
```

### Additional configs

There are additional configs for specific language features:

| Config | Description |
|--------|-------------|
| @trigen/oxlint-config/commonjs | Rules for CommonJS modules. |
| @trigen/oxlint-config/module | Rules for ES modules. |
| @trigen/oxlint-config/bundler | Rules for ES modules with bundler's module resolution. |
| @trigen/oxlint-config/test | Rules for test files. |
| @trigen/oxlint-config/react | Rules for React code. |
| @trigen/oxlint-config/storybook | Rules for Storybook stories. |
| @trigen/oxlint-config/typescript | Rules for TypeScript code. |
| @trigen/oxlint-config/typescript-type-checked | Rules for TypeScript code with type checking. |

Example:

```ts
import baseConfig from '@trigen/oxlint-config'
import bundlerConfig from '@trigen/oxlint-config/bundler'
import reactConfig from '@trigen/oxlint-config/react'
import typescriptConfig from '@trigen/oxlint-config/typescript-type-checked'
import testConfig from '@trigen/oxlint-config/test'
import storybookConfig from '@trigen/oxlint-config/storybook'

export default {
  extends: [
    baseConfig,
    bundlerConfig,
    reactConfig,
    typescriptConfig,
    testConfig,
    storybookConfig
  ]
}
```
