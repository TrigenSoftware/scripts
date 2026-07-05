---
name: project
description: Scaffold the base of a new Trigen-style project (Node.js/frontend, TypeScript/JavaScript, single package or pnpm monorepo) by copying and adapting config files from reference repositories — toolchain, linting, git hooks, GitHub workflows, and simple-release publishing. Apply when creating a new project or bringing an existing one up to the Trigen project baseline.
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
    - scaffolding
    - project-setup
    - pnpm
    - monorepo
    - github-actions
---

# Project Base

Generate a project base from reference repositories: pick the closest references, fetch their config files, and adapt them — do not write configs from memory.

## Process

1. **Clarify the project profile if the user hasn't specified it.** You need four answers before generating:
   - language: TypeScript or JavaScript;
   - runtime: Node.js, frontend (browser), or both;
   - structure: single package or pnpm monorepo;
   - kind: published library or GitHub action (affects publishing/release setup).
2. **Pick 1–2 references** from the table below that best match the profile.
3. **Fetch the actual files** from the reference repos (e.g. `https://raw.githubusercontent.com/<org>/<repo>/HEAD/<path>`, or `gh api`) and use them as the source. References evolve; the fetched file wins over anything written in this skill.
4. **Adapt** the copied files: project/package names, org and repo URLs, description, author, commitlint scopes, Node.js/pnpm versions (keep workflows in sync with `.tool-versions`). Drop files irrelevant to the profile (e.g. `pnpm-workspace.yaml` for a single package, `.size-limit.json` when bundle size doesn't matter).
5. **Finish up:** `pnpm install`, `pnpm updateGitHooks`, then verify `pnpm test` passes.

## References

| Repository | Description | Profile |
|------------|-------------|---------|
| [browserslist/browserslist-useragent-regexp](https://github.com/browserslist/browserslist-useragent-regexp) | Compile a browserslist query to a RegExp to test browser useragents | TS · Node.js |
| [conventional-changelog/conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) | Changelogs and release notes from commit messages | TS · Node.js · monorepo |
| [TrigenSoftware/simple-release](https://github.com/TrigenSoftware/simple-release) | Release tool with monorepo support | TS · Node.js · monorepo |
| [TrigenSoftware/simple-release-action](https://github.com/TrigenSoftware/simple-release-action) | GitHub action to release projects | TS · Node.js · GitHub action |
| [TrigenSoftware/simple-libs](https://github.com/TrigenSoftware/simple-libs) | Set of packages with simple utilities | TS · Node.js · monorepo |
| [TrigenSoftware/nano_kit](https://github.com/TrigenSoftware/nano_kit) | Ecosystem of lightweight reactive libraries | TS · Node.js + frontend · monorepo |
| [TrigenSoftware/scripts](https://github.com/TrigenSoftware/scripts) | Scripts and configs for Trigen projects | JS · Node.js · monorepo |
| [TrigenSoftware/ua-regexes-lite](https://github.com/TrigenSoftware/ua-regexes-lite) | Lite useragent regexes collection | JS · Node.js |
| [TrigenSoftware/masonry-grid](https://github.com/TrigenSoftware/masonry-grid) | Masonry grid layout library in vanilla JS | TS · frontend · monorepo |
| [TrigenSoftware/Argue](https://github.com/TrigenSoftware/Argue) | Strongly typed CLI arguments parser | TS · Node.js |

## Stack

Every tool has one job; together they form the baseline:

- **asdf** (`.tool-versions`) — pins `nodejs` and `pnpm` versions; GitHub workflows must use the same versions.
- **pnpm** — package manager; `pnpm-workspace.yaml` lists `packages/*` for monorepos (plus `autoInstallPeers`, `allowBuilds`).
- **TypeScript** — `tsconfig.json` (dev, includes tests) and `tsconfig.build.json` (publish build); `env.d.ts` for ambient types.
- **oxlint** (`oxlint.config.ts` with `@trigen/oxlint-config`, `defineConfig` from `@trigen/oxlint`) — linting; extend `base` + `test` configs, set `env`.
- **lint-package-json** (`.npmpackagejsonlintrc.json`) — validates `package.json` files, `--monorepo` flag in monorepos.
- **editorconfig** (`.editorconfig`) — 2-space indent, LF, UTF-8, final newline; enforced in CI by editorconfig-checker.
- **commitlint + commitizen** (`.commitlintrc.js`, `.czrc` → `@commitlint/cz-commitlint`) — conventional commits; in monorepos extend `@commitlint/config-pnpm-scopes` and add extra scopes (`deps`, `dev-deps`, `release`); `pnpm commit` runs the prompt.
- **simple-git-hooks** (`.simple-git-hooks.json`) — `commit-msg` → `commitlint --edit`, `pre-commit` → `nano-staged`, `pre-push` → `pnpm test`.
- **nano-staged** (`.nano-staged.json`) — runs `oxlint --fix` on staged JS/TS files.
- **vite + vitest** (`vite.config.*`) — build (if needed) and unit tests (`test:unit` script).
- **size-limit** (`.size-limit.json`) — bundle size budget; only for libraries where size matters (frontend).
- **clean-publish** (`.clean-publish`) — publishes a cleaned copy from the `package` temp dir; pairs with `publishConfig.directory: "package"` and `prepublishOnly`/`postpublish` scripts in each published package.
- **simple-release** (`.simple-release.json`) — versioning/changelog/publish; for monorepos use `@simple-release/pnpm#PnpmWorkspacesProject` (`mode: "fixed"` for a single shared version).
- **renovate** (`.github/renovate.json`) — dependency updates; `config:recommended` + `:preserveSemverRanges`.

## GitHub workflows

- `checks.yml` — on PRs to `main`: editorconfig check + `lint:package-json`.
- `tests.yml` — on PRs and pushes to `main`: `lint` and `test:unit` as separate jobs.
- `commit.yml` — on every push: `commitlint --from=HEAD~1`.
- `release.yml` — on pushes to `main` and issue comments: `trigensoftware/simple-release-action` with three jobs — `check` (context check) routes to `pull-request` (create/update release PR) or `release` (publish with `NPM_TOKEN`).

All Node.js jobs: `pnpm/action-setup` → `actions/setup-node` with `cache: 'pnpm'` → `pnpm install`.

## package.json conventions

- Root: `"type": "module"`, `engines.node`, `repository`/`bugs` URLs; `"private": true` in monorepos.
- Scripts: `clear` (del artifacts/caches), `lint`, `lint:package-json` (monorepo), `test:unit`, `test:unit:watch`, `test` (lint + unit), `commit` (`cz`), `updateGitHooks` (`simple-git-hooks`).
- Published packages additionally: `exports` map pointing into `src/` (or build output), `publishConfig` (`access: public`, `directory: "package"`, `linkDirectory: false`), `prepublishOnly: "del ./package && clean-publish"`, `postpublish: "del ./package"`.

## File inventory

Files to look for in references and generate, grouped by concern:

```
Toolchain:   .tool-versions  .editorconfig  .gitignore
Packages:    package.json  pnpm-workspace.yaml  packages/*/package.json
TypeScript:  tsconfig.json  tsconfig.build.json  env.d.ts
Lint:        oxlint.config.*  .npmpackagejsonlintrc.json
Commits:     .commitlintrc.*  .czrc  .simple-git-hooks.json  .nano-staged.json
Build/test:  vite.config.*  .size-limit.json
Release:     .clean-publish  .simple-release.*
GitHub:      .github/workflows/{checks,tests,commit,release}.yml  .github/renovate.json
             .github/ISSUE_TEMPLATE/{config,bug-report,feature-request,question}.yml  .github/FUNDING.yml
Docs:        README.md (badges: npm, node, dependencies, build)  LICENSE (MIT)
```

`CHANGELOG.md` is generated by simple-release — don't create it by hand.
