---
name: eslint-to-oxlint
description: Migrate Trigen-style repositories from @trigen/eslint-config to @trigen/oxlint-config, including package scripts, Node engines, oxlint.config.ts/mts files, nested monorepo configs, and cleanup of old ESLint config usage.
license: MIT
compatibility:
  - Claude Code
  - Codex
  - Cursor
  - Gemini CLI
  - GitHub Copilot
  - Windsurf
  - Cline
  - Roo Code
  - Goose
  - Continue
  - OpenCode
  - Amp
  - universal
metadata:
  author: dangreen
  tags:
    - eslint
    - oxlint
    - trigen
    - migration
    - javascript
    - typescript
---

# ESLint To Oxlint

Use this skill when migrating a repository that currently consumes
`@trigen/eslint-config` to `@trigen/oxlint-config`.

## Goal

Replace active ESLint config usage with Oxlint config usage while preserving the
same repository intent:

- root and package lint configs use `@trigen/oxlint-config`
- `lint` script runs `oxlint`
- old `eslint.config.*` and `.eslintrc.*` consumers are removed
- the existing `packages/eslint-config` package is not deleted unless the user
  explicitly asks to remove or deprecate that package

## First Pass

Inspect before editing:

```bash
rg --files -g 'eslint.config.*' -g '.eslintrc*' -g 'package.json'
rg -n '@trigen/eslint-config|eslint\.config|eslintrc|eslint' package.json packages .github README.md
rg -n '"node"\s*:' package.json packages/*/package.json
```

Treat these as different things:

- Active usage: root/package `eslint.config.*`, `.eslintrc.*`, package deps on
  `@trigen/eslint-config`, scripts running `eslint`.
- Package source: `packages/eslint-config/**`. Leave this alone unless requested.
- Oxlint rule namespace: rules like `eslint/no-console` inside Oxlint configs.
  Do not remove these; they are Oxlint rule IDs.
- JS plugins used by `@trigen/oxlint-config`, such as `@stylistic/eslint-plugin`.
  Do not remove these just because their package names contain `eslint`.

## Dependencies And Engines

Use the repository package manager. Prefer `pnpm` if present.

For normal consumer repos:

```bash
pnpm add -D oxlint @trigen/oxlint-config
```

For TypeScript repositories, also install the optional type-aware backend:

```bash
pnpm add -D oxlint-tsgolint
```

`@trigen/oxlint-config` requires Node 22+. If the repository still runs older
Node versions, tell the user before changing runtime policy. It is reasonable to
offer updating local and CI Node versions, for example:

```text
nodejs 22.18.0
```

For GitHub Actions, suggest using Node 22 and removing older Node matrix entries
only when the repository is ready to drop them.

## Scripts

Replace ESLint lint scripts with Oxlint:

```json
"lint": "oxlint"
```

Keep unrelated scripts intact. If the repo has package-specific lint scripts,
update those too.

## Config Files

Prefer `oxlint.config.ts`.

Oxlint does not read `oxlint.config.mts`. For CommonJS packages, do not suggest
`.mts`; either make the package/config loadable as `oxlint.config.ts` under the
current Node/Oxlint setup, or discuss converting the package to ESM when that is
acceptable.

### Root Config

Basic root shape:

```ts
import baseConfig from '@trigen/oxlint-config'
import testConfig from '@trigen/oxlint-config/test'

export default {
  ignorePatterns: ['**/package/'],
  options: {
    typeAware: true,
    typeCheck: true
  },
  extends: [
    baseConfig,
    testConfig
  ],
  env: {
    node: true
  }
}
```

Only add `options.typeAware` and `options.typeCheck` when the repository uses
TypeScript or type-aware Oxlint rules. In that case, ensure `oxlint-tsgolint` is
installed.

Translate ESLint environment configs to Oxlint `env`/`globals` fields. There is
no `@trigen/oxlint-config/env` equivalent.

### Package Config

Use package-specific config files when the old ESLint setup had package-level
configs.

Important: because Oxlint nested config merging has been buggy, put
`...rootConfig` first and include `rootConfig` in `extends`.

```ts
import moduleConfig from '@trigen/oxlint-config/module'
import testConfig from '@trigen/oxlint-config/test'
import rootConfig from '../../oxlint.config.ts'

export default {
  ...rootConfig,
  extends: [
    rootConfig,
    moduleConfig,
    testConfig
  ]
}
```

Import package configs before relative `rootConfig` imports.

Use these imports as analogs:

| Old ESLint config | New Oxlint config |
|---|---|
| `@trigen/eslint-config` | `@trigen/oxlint-config` |
| `@trigen/eslint-config/commonjs` | `@trigen/oxlint-config/commonjs` |
| `@trigen/eslint-config/module` | `@trigen/oxlint-config/module` |
| `@trigen/eslint-config/bundler` | `@trigen/oxlint-config/bundler` |
| `@trigen/eslint-config/test` | `@trigen/oxlint-config/test` |
| `@trigen/eslint-config/react` | `@trigen/oxlint-config/react` |
| `@trigen/eslint-config/storybook` | `@trigen/oxlint-config/storybook` |
| `@trigen/eslint-config/typescript` | `@trigen/oxlint-config/typescript` |
| `@trigen/eslint-config/typescript-type-checked` | `@trigen/oxlint-config/typescript-type-checked` |

For old `dom-test` or `react-test` configs, start from `test`, `react`, and
explicit `env`/`globals` overrides; only add custom rules if the repo actually
needs them.

## Cleanup

After creating Oxlint configs:

- delete active `eslint.config.*` files
- delete active `.eslintrc.*` files
- remove `@trigen/eslint-config` from consumer package dependencies
- remove `eslint` CLI dependencies from consumers when they are no longer used
- remove `.eslintrc.*` entries from template file lists, if the repo has them
- keep README/package references to `@trigen/eslint-config` only when they are
  documenting the eslint-config package itself

Do not delete `packages/eslint-config` unless the user explicitly asks.

## Oxlint Config Gotchas

- Top-level ignores use `ignorePatterns`.
- Inside `overrides`, Oxlint expects `files`, `excludeFiles`, `env`,
  `globals`, `plugins`, `jsPlugins`, and `rules`; do not use `ignores` there.
- When you need negation inside override matching, use `files` patterns with
  `!pattern`.
- Rules like `eslint/no-unused-vars`, `import/no-default-export`,
  `typescript/no-explicit-any`, and `trigen/import-order` are valid Oxlint rule
  IDs in Trigen's Oxlint config ecosystem.

## Verification

Run focused checks while migrating:

```bash
pnpm oxlint --deny-warnings
pnpm test:unit
```

Do not rely on `oxlint --print-config`; it has produced misleading output for
nested/extended configs. Validate by running Oxlint on real files instead.

If full `pnpm oxlint` fails because newly enabled rules catch existing code,
fix the code when the fix is mechanical and local, such as import order. If the
failure is broad or changes project policy, report it and ask before relaxing
rules.

Before finishing, confirm:

```bash
rg --files -g 'eslint.config.*' -g '.eslintrc*'
rg -n '@trigen/eslint-config|eslint\.config|eslintrc' --glob '!packages/eslint-config/**' --glob '!README.md' --glob '!**/CHANGELOG.md'
```

The first two searches should be empty outside intentional package
documentation/source.
