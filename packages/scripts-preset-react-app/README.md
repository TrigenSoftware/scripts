# @trigen/scripts-preset-react-app

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]
[![Dependabot badge][dependabot]][dependabot-url]

[npm]: https://img.shields.io/npm/v/%40trigen/scripts-preset-react-app.svg
[npm-url]: https://www.npmjs.com/package/@trigen/scripts-preset-react-app

[node]: https://img.shields.io/node/v/%40trigen/scripts-preset-react-app.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/TrigenSoftware/scripts.svg?path=packages/scripts-preset-react-app
[deps-url]: https://david-dm.org/TrigenSoftware/scripts?path=packages/scripts-preset-react-app

[build]: http://img.shields.io/travis/com/TrigenSoftware/scripts.svg
[build-url]: https://travis-ci.com/TrigenSoftware/scripts

[dependabot]: https://api.dependabot.com/badges/status?host=github&repo=TrigenSoftware/scripts
[dependabot-url]: https://dependabot.com/

React app scripts preset.

## Usage

1. Install scripts package

```bash
yarn add -D @trigen/scripts-preset-react-app
```

2. Add installed scripts to `.trigenscriptsrc`

```json
[
    "preset-react-app",
    "./some/other"
]
```

3. Now you can run some script

```bash
yarn exec -- trigen-scripts start
```

## Available scripts

```bash
# Lint only styles
yarn lint:styles
# Lint only scripts
yarn lint:scripts
# Lint all sources
yarn lint
# Run tests with Jest
yarn jest
# Run type checking
yarn typecheck
# Run lint, tests and build
yarn test
# Generate docs for typescript sources
yarn build:docs
# Start Storybook
yarn start:storybook
# Build standalone Storybook bundle
yarn build:storybook
# Start development server
yarn start
# Build app
yarn build
# Build app renderer
yarn build:render
# Serve files from `build` directory
yarn serve
```

## Environment variables

Optional variables:

```bash
PROXY_API_URI='' # valid URI; not set by default
DISABLE_BROWSER_SYNC=false # boolean; `false` by default
```

You can create `.env` in project root with this variables.
