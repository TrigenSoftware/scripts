# @trigen/eslint-config

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]

[npm]: https://img.shields.io/npm/v/%40trigen/eslint-config.svg
[npm-url]: https://npmjs.com/package/@trigen/eslint-config

[node]: https://img.shields.io/node/v/%40trigen/eslint-config.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/@trigen/eslint-config
[deps-url]: https://libraries.io/npm/@trigen%2Feslint-config/tree

[size]: https://packagephobia.com/badge?p=@trigen/eslint-config
[size-url]: https://packagephobia.com/result?p=@trigen/eslint-config

[build]: https://img.shields.io/github/actions/workflow/status/TrigenSoftware/scripts/tests.yml?branch=main
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

Create `eslint.config.js` with next content:

```js
import baseConfig from '@trigen/eslint-config'

export default baseConfig
```

### Additional configs

There are additional configs for specific language features:

| Config | Description |
|--------|-------------|
| @trigen/eslint-config/env | Globals for different environments. |
| @trigen/eslint-config/commonjs | Rules for CommonJS modules. |
| @trigen/eslint-config/module | Rules for ES modules. |
| @trigen/eslint-config/bundler | Rules for ES modules with bundler's module resolution. |
| @trigen/eslint-config/test | Rules for test files. |
| @trigen/eslint-config/dom-test | Rules for DOM tests. |
| @trigen/eslint-config/react | Rules for React code. |
| @trigen/eslint-config/react-test | Rules for React tests. |
| @trigen/eslint-config/storybook | Rules for Storybook stories. |
| @trigen/eslint-config/typescript | Rules for TypeScript code. |
| @trigen/eslint-config/typescript-type-checked | Rules for TypeScript code with type checking. |

Example:

```js
import baseConfig from '@trigen/eslint-config'
import env from '@trigen/eslint-config/env'
import bundlerConfig from '@trigen/eslint-config/bundler'
import reactConfig from '@trigen/eslint-config/react'
import typescriptConfig from '@trigen/eslint-config/typescript-type-checked'
import testConfig from '@trigen/eslint-config/test'
import reactTestConfig from '@trigen/eslint-config/react-test'
import storybookConfig from '@trigen/eslint-config/storybook'

export default [
  env.browser,
  ...baseConfig,
  ...bundlerConfig,
  ...reactConfig,
  ...typescriptConfig,
  ...testConfig,
  ...reactTestConfig,
  ...storybookConfig,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        projectService: true
      }
    }
  }
]
```
