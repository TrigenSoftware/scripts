---
name: unit-tests
description: Conventions for writing unit tests in Trigen-style repositories — Vitest, colocated *.spec.ts files, describe groups that mirror the unit's address (package → folders → module → unit in monorepos, folders → module → unit in single-package projects), and "it should" test titles. Apply when writing, editing, or reviewing unit tests.
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
    - testing
    - vitest
    - unit-tests
    - conventions
---

# Unit Tests

Unit tests use Vitest and live next to the source they test: `src/module.spec.ts` beside `src/module.ts` (`.spec.tsx` for component tests, `.spec.js` in JS packages). No `__tests__` directories.

## Imports and primitives

Import test primitives by name from `vitest`:

```ts
import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
```

Always use `it`, never `test`. Import `vi` only when the file actually mocks or fakes something.

## describe groups

The `describe` chain spells out the unit's full address, outermost to innermost, so a failing test is locatable from its title alone. Each address segment is its own nested `describe` — never join segments into one string like `describe('uikit/RichTextEditor/utils')`.

**In a monorepo** the chain is package name → folder segments under `src/` → module (file name) → exported unit under test:

```ts
// packages/git-client/src/utils.spec.ts
describe('git-client', () => {
  describe('utils', () => {
    describe('formatArgs', () => {
      it('should format arguments', () => {
        // ...
      })
    })
  })
})
```

```ts
// packages/kida/src/internals/child.spec.ts
describe('kida', () => {
  describe('internals', () => {
    describe('child', () => {
      // ...
    })
  })
})
```

The package level uses the unscoped package directory name (`git-client`, not `@conventional-changelog/git-client`).

**In a single-package project** the chain is the same minus the package level — folder segments relative to the source root, then module, then unit:

```ts
// src/core.spec.ts
describe('core', () => {
  describe('read', () => {
    it('should read args', () => {
      // ...
    })
  })
})
```

```ts
// app/uikit/RichTextEditor/utils.spec.ts
describe('uikit', () => {
  describe('RichTextEditor', () => {
    describe('utils', () => {
      describe('createRichTextDoc', () => {
        // ...
      })
    })
  })
})
```

**Redundant levels collapse:**

- `index.spec.ts` skips the module level — the unit comes right after the package: `oxlint > defineConfig`.
- When the module's single public export is the unit, the unit name replaces the file name: `nanoviews > elements > $$ref` (not `... > ref > $$ref`).
- A unit with distinct modes or scenarios gets one more `describe` per scenario: `core > manifest > PackageJsonMonorepoProject > independent mode`.

Don't add levels that carry no information, and don't drop the package level in a monorepo — cross-package test output must stay distinguishable.

## it should

Every test title is a `should` + behavior phrase describing the expected outcome, not the implementation:

```ts
it('should merge ignore patterns from extended configs', () => {})
it('should return empty array when no args left', () => {})
it('should throw error when unexpected arg', () => {})
```

- One behavior per `it`; a second expected behavior is a second test.
- Conditions go into the title after the behavior: `when ...`, `if ...`, `without ...`.
- Variants of the same behavior are separate `it`s under the unit's `describe`, or under a scenario `describe` when a whole group of tests shares a mode.

Some older ported test suites contain non-`should` titles; don't copy that style — new tests always use `should`.
