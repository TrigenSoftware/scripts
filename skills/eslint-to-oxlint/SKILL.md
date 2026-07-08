---
name: eslint-to-oxlint
description: Migrate Trigen-style repositories from @trigen/eslint-config to @trigen/oxlint-config, including package scripts, Node runtime setup, oxlint.config.ts files, nested monorepo configs, and cleanup of old ESLint config usage.
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

Use this skill when migrating a repository that currently consumes `@trigen/eslint-config` to `@trigen/oxlint-config`.

## Goal

Replace active ESLint config usage with Oxlint config usage while preserving the same repository intent:

- root and package lint configs use `@trigen/oxlint-config`
- root and package `oxlint.config.ts` files wrap config objects with `defineConfig` from `@trigen/oxlint`
- direct ESLint CLI scripts become direct Oxlint CLI scripts
- staged-file ESLint hooks, such as `.nano-staged.json`, become Oxlint hooks
- workspace orchestration scripts keep their orchestration behavior
- old `eslint.config.*` and `.eslintrc.*` consumers are removed
- the existing `packages/eslint-config` package is not deleted unless the user explicitly asks to remove or deprecate that package

## First Pass

Inspect before editing:

```bash
rg --files -g 'eslint.config.*' -g '.eslintrc*' -g 'package.json' -g '.nano-staged.json'
rg -n '@trigen/eslint-config|eslint\.config|eslintrc|eslint' package.json packages examples website .github README.md
test -f .nano-staged.json && rg -n 'eslint|oxlint' .nano-staged.json || true
rg -n '"lint"\s*:|"format"\s*:|"eslint"\s*:|"@trigen/eslint-config"' package.json packages/*/package.json examples/**/package.json website/package.json
rg --files -g 'tsconfig.json' packages examples website
```

Treat these as different things:

- Active usage: root/package `eslint.config.*`, `.eslintrc.*`, package deps on `@trigen/eslint-config`, scripts running `eslint`, and staged-file hooks running `eslint`.
- Package source: `packages/eslint-config/**`. Leave this alone unless requested.
- Oxlint rule namespace: rules like `eslint/no-console` inside Oxlint configs. Do not remove these; they are Oxlint rule IDs.
- JS plugins used by `@trigen/oxlint-config`, such as `@stylistic/eslint-plugin`. Do not remove these just because their package names contain `eslint`.
- `engines.node` values in `package.json`. Do not edit them during this migration.
- Generated output: `.next/`, `.svelte-kit/`, `dist/`, `build/`, `coverage/`, and package manager stores. Do not migrate or edit generated files even when they contain copied ESLint comments.

When working in a repository that already has staged migration work, inspect staged changes too:

```bash
git diff --staged --stat
git diff --staged --name-only
```

Use this to avoid duplicating work, to understand already chosen config shapes, and to summarize only the current step when the user asks what changed.

## Dependencies And Engines

Use the repository package manager. Prefer `pnpm` if present.

For normal consumer repos:

```bash
pnpm add -D oxlint @trigen/oxlint @trigen/oxlint-config
```

For TypeScript repositories, also install the optional type-aware backend:

```bash
pnpm add -D oxlint-tsgolint
```

`@trigen/oxlint` and `@trigen/oxlint-config` require Node 22+. Do not edit `engines.node` in `package.json`. If local tooling or CI uses Node <22, tell the user and offer to update only runtime selectors such as `.tool-versions` and GitHub Actions `node-version`.

If `.tool-versions` already uses Node 22+ or 24+, leave it alone. Only suggest a change when it is below Node 22. A valid minimum example is:

```text
nodejs 22.18.0
```

For GitHub Actions, suggest using Node 22+ and removing older Node matrix entries only when the repository is ready to drop them.

## Scripts

Only replace direct ESLint CLI invocations with equivalent Oxlint CLI invocations.

```json
"lint": "oxlint"
```

Do not replace workspace orchestration scripts with plain `oxlint`. Preserve commands such as:

```json
"lint": "pnpm -r --parallel --if-present --filter './packages/*' lint"
```

For those scripts, update the package-level scripts they call, not the orchestrator itself.

Keep unrelated scripts intact.

If the repository has package-level `lint` scripts, add matching package-level `format` scripts only when requested or when the migration policy includes formatting:

```json
"format": "oxlint --fix"
```

For workspace roots, keep orchestration behavior analogous to `lint`:

```json
"format": "pnpm -r --parallel --if-present --filter './packages/*' format"
```

### Staged Hooks

If the repository uses `.nano-staged.json`, inspect it during migration. Replace direct ESLint staged-file commands with Oxlint equivalents while preserving the same file patterns and unrelated commands:

```json
{
  "*.{c,m,}{js,ts}{x,}": "oxlint --fix"
}
```

Do not remove `nano-staged` or hook setup dependencies just because the staged command changes. If a staged command chains formatting or tests with ESLint, only replace the direct ESLint segment and keep the rest of the chain's intent.

## Config Files

Prefer `oxlint.config.ts`.

Always use the config helper from `@trigen/oxlint`:

```ts
import { defineConfig } from '@trigen/oxlint'
```

Wrap every root and package config object in `defineConfig(...)`. This helper fixes inheritance problems in Oxlint's standard config behavior, including merged `ignorePatterns`/`env` from extended configs and top-level `rules` handling.

Oxlint does not read `oxlint.config.mts`. For CommonJS packages, do not suggest `.mts`; either make the package/config loadable as `oxlint.config.ts` under the current Node/Oxlint setup, or discuss converting the package to ESM when that is acceptable.

### Root Config

Basic root shape:

```ts
import { defineConfig } from '@trigen/oxlint'
import baseConfig from '@trigen/oxlint-config'
import testConfig from '@trigen/oxlint-config/test'

export default defineConfig({
  ignorePatterns: ['**/package/'],
  options: {
    typeAware: true,
    typeCheck: true
  },
  env: {
    node: true
  },
  extends: [
    baseConfig,
    testConfig
  ]
})
```

Only add `options.typeAware` and `options.typeCheck` when the repository uses TypeScript or type-aware Oxlint rules. In that case, ensure `oxlint-tsgolint` is installed.

Translate ESLint environment configs to Oxlint `env`/`globals` fields. There is no `@trigen/oxlint-config/env` equivalent.

### Package Config

Use package-specific config files when the old ESLint setup had package-level configs.

Put `rootConfig` first in `extends`. Do not spread `rootConfig` into the local object or reset `options`; `defineConfig` handles the inheritance fixes for nested configs.

```ts
import { defineConfig } from '@trigen/oxlint'
import moduleConfig from '@trigen/oxlint-config/module'
import testConfig from '@trigen/oxlint-config/test'
import rootConfig from '../../oxlint.config.ts'

export default defineConfig({
  extends: [
    rootConfig,
    moduleConfig,
    testConfig
  ]
})
```

Import package configs before relative `rootConfig` imports.

Preserve the old type-checking intent exactly. If an old ESLint config used `typescript-type-checked`, import `@trigen/oxlint-config/typescript-type-checked`; do not silently downgrade it to `typescript`.

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

For old `dom-test` or `react-test` configs, start from `test`, `react`, and explicit `env`/`globals` overrides; only add custom rules if the repo actually needs them.

For Svelte configs, set `env.svelte = true` and commonly disable rules that misread Svelte files:

```ts
rules: {
  'stylistic-js/indent': 'off',
  'eslint/no-undef': 'off'
}
```

After running `oxlint --fix` on Svelte files, inspect `<script>` blocks for broken indentation. A common failure mode is an `import type` line being moved to column 0 while the rest of the script body stays indented.

### Monorepo And Nested Configs

Migrate all active config scopes, not only package roots:

- root config
- `packages/*/oxlint.config.ts`
- nested package configs such as `packages/*/src/internals/oxlint.config.ts`
- `examples/**/oxlint.config.ts`
- `website/oxlint.config.ts`

When translating nested configs, base the new Oxlint config on the nearest old `eslint.config.js` and the already established sibling Oxlint configs. Keep custom `rules`, `env`, `globals`, and `overrides` local to that scope.

If a config contains an override that remaps imported configs only to force module JS files, reassess it after moving to bundler config. Remove no-longer needed override boilerplate rather than preserving accidental ESLint structure.

### TypeScript Project Includes

When adding `oxlint.config.ts` at a package/example root, ensure the relevant `tsconfig.json` includes root-level TypeScript config files. If the tsconfig has an explicit `include` array, add:

```json
"*.ts"
```

Do not add it to tsconfigs that intentionally rely on TypeScript's default include behavior or framework-generated tsconfig behavior unless the config file is otherwise excluded.

For packages that emit declaration files from a separate `tsconfig.build.json`, keep TypeScript project membership and declaration emit compatible:

- add root-level TypeScript config files to package/example `tsconfig.json` `include` arrays, usually with `*.ts`, so TypeScript does not complain that `oxlint.config.ts` is outside the project
- enable `compilerOptions.allowImportingTsExtensions` so TypeScript accepts explicit `.ts` imports used by `oxlint.config.ts` files
- when `allowImportingTsExtensions` is enabled in an emit-capable base config, also enable `compilerOptions.rewriteRelativeImportExtensions`; otherwise TypeScript rejects emit with explicit TypeScript extension imports
- exclude root/tool config files from `tsconfig.build.json` with `**/*.config.ts`, because base/package tsconfigs explicitly include `*.ts` for config-file project membership, but those config files must not be part of declaration emit

Typical root shape for emit-capable packages:

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "NodeNext",
    "allowImportingTsExtensions": true,
    "rewriteRelativeImportExtensions": true,
    "declaration": true
  }
}
```

Typical package build shape after adding `oxlint.config.ts`:

```jsonc
// tsconfig.build.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "dist"
  },
  "include": [
    "src"
  ],
  "exclude": [
    "**/*.config.ts",
    "**/*.spec.ts"
  ]
}
```

Preserve package-specific build excludes such as stories, tests, client entry points, renderer entry points, or framework-generated folders. Add `**/*.config.ts` without removing the existing excludes.

## Cleanup

After creating Oxlint configs:

- delete active `eslint.config.*` files
- delete active `.eslintrc.*` files
- remove `@trigen/eslint-config` from consumer package dependencies
- remove `eslint` CLI dependencies from consumers when they are no longer used
- remove direct `eslint` commands from `.nano-staged.json`, if present
- keep `@trigen/oxlint`, `oxlint`, and `@trigen/oxlint-config`; they are active migration dependencies
- remove `.eslintrc.*` entries from template file lists, if the repo has them
- keep README/package references to `@trigen/eslint-config` only when they are documenting the eslint-config package itself

Do not delete `packages/eslint-config` unless the user explicitly asks.

After the config migration is working, offer the user a separate source-code cleanup pass to replace ESLint inline directive comments with Oxlint directives. Do not do this silently. Look for comments such as:

```text
eslint-disable
eslint-enable
eslint-disable-line
eslint-disable-next-line
```

and migrate them to the corresponding Oxlint directive form supported by the current Oxlint version.

When the user explicitly requests this cleanup, do it as a loop over code files and comments:

1. Remove one `eslint-disable*` comment.
2. Run `pnpm oxlint ./path/to/file`.
3. If the removal introduces an Oxlint diagnostic, restore the comment as the corresponding `oxlint-disable*` directive with Oxlint rule IDs.
4. If no new diagnostic appears, leave the comment removed.
5. Continue with the next comment, then the next file.

Use a timeout and visible progress for long cleanup runs. Exclude generated directories such as `.next`, `.svelte-kit`, `dist`, `build`, and `coverage`. Because Oxlint warnings may not produce a non-zero exit code, parse the output for diagnostics instead of relying only on the command status.

Common rule namespace conversions:

| ESLint directive rule | Oxlint directive rule |
|---|---|
| `@typescript-eslint/no-explicit-any` | `typescript/no-explicit-any` |
| `@typescript-eslint/no-magic-numbers` | `eslint/no-magic-numbers` |
| `@typescript-eslint/naming-convention` | usually delete if no diagnostic, otherwise use the reported Oxlint rule |
| `prefer-const` | `eslint/prefer-const` |
| `max-params` | `eslint/max-params` |
| `react-hooks/exhaustive-deps` | `react-hooks/exhaustive-deps` |
| `import/extensions` | often delete if no diagnostic |

## Oxlint Config Gotchas

- Top-level ignores use `ignorePatterns`.
- Inside `overrides`, Oxlint expects `files`, `excludeFiles`, `env`, `globals`, `plugins`, `jsPlugins`, and `rules`; do not use `ignores` there.
- When you need negation inside override matching, use `files` patterns with `!pattern`.
- Rules like `eslint/no-unused-vars`, `import/no-default-export`, `typescript/no-explicit-any`, and `trigen/import-order` are valid Oxlint rule IDs in Trigen's Oxlint config ecosystem.
- Oxlint may flag `typescript/unbound-method` on methods that are bound at runtime but typed as class methods. Prefer a narrow type-level fix such as a `Bound<T, K>` helper for returned objects over broad rule suppression.
- In React/Preact/Solid component prop types, prefer callback properties (`onChange: (value: string) => void`) over method signatures (`onChange(value: string): void`) when Oxlint or TypeScript semantics treat the distinction as meaningful.

## Verification

Run focused checks while migrating:

```bash
pnpm oxlint --deny-warnings
pnpm test:unit
```

Do not rely on `oxlint --print-config`; it has produced misleading output for nested/extended configs. Validate by running Oxlint on real files instead.

If full `pnpm oxlint` fails because newly enabled rules catch existing code, fix the code when the fix is mechanical and local, such as import order. If the failure is broad or changes project policy, report it and ask before relaxing rules.

Before finishing, confirm:

```bash
rg --files -g 'eslint.config.*' -g '.eslintrc*'
rg -n '@trigen/eslint-config|eslint\.config|eslintrc' --glob '!packages/eslint-config/**' --glob '!README.md' --glob '!**/CHANGELOG.md'
test -f .nano-staged.json && rg -n 'eslint --|eslint ' .nano-staged.json || true
git grep -n 'eslint-disable' -- '*.js' '*.jsx' '*.ts' '*.tsx' '*.d.ts' || true
```

The first two searches should be empty outside intentional package documentation/source.

Do not run checks the user explicitly told you not to run. If checks were skipped, say so plainly in the final response.
