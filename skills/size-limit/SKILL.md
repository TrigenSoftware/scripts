---
name: size-limit
description: Set up and maintain size-limit checks for browser-targeted, tree-shakeable library packages — .size-limit.json per package, Brotli entries with optional low-noise Gzip twins, limits pinned on a 0.05 kB step to neutralize compression noise, and a rebuild-and-re-pin routine after changes. Apply when adding size checks to a package or updating limits after code changes.
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
    - size-limit
    - bundle-size
    - library
    - ci
---

# Size Limit

Pin bundle size as a tested contract with [size-limit](https://github.com/ai/size-limit): every package with a public surface gets a `.size-limit.json`, and any regression fails `npx size-limit` instead of silently shipping.

Size-limit only makes sense for libraries that target the browser and are designed for tree-shaking (see the `tree-shaking` skill): the measured number is what a consumer's bundler ships over the wire. For Node-only tools, CLIs, or server-side code, bundle size is not the constraint — skip it there.

## Setup

Per package with a public surface:

- dev dependencies: `size-limit` + `@size-limit/preset-small-lib`;
- a script: `"test:size": "size-limit"`;
- a `.size-limit.json` next to `package.json`.

Each entry measures one bundle (`path` + optional `import` subset) against a pinned `limit`:

```json
[
  {
    "name": "All publics",
    "path": "dist/index.js",
    "import": "*",
    "limit": "2.75 kB"
  },
  {
    "name": "Signal",
    "path": "dist/index.js",
    "import": "{ signal }",
    "limit": "1.35 kB"
  }
]
```

Brotli is size-limit's default compression, so entries need no flag and no suffix in the name — the `(Gzip)`/`(Brotli)` suffixes appear only in the doubled variant below.

For tree-shakeable libraries, measure several import subsets of the same dist file (minimal, popular, all publics via `import: "*"`) — see the `tree-shaking` skill. A regression then shows up as a specific entry blowing its limit, and the delta between subsets is the size of the subsystem being measured as droppable.

## Noise, and how limits are pinned

Brotli output is noisy at small sizes: an unrelated one-line change can move the compressed size by a few bytes in either direction, and deciding from that noise is hard. Two mechanisms compensate:

**Limits are pinned on a 0.05 kB step.** Take the measured size and round it **up to the next multiple of 50 bytes** — no extra headroom on top. The step absorbs compression jitter, so a limit only moves when the code actually grew. Values under 1000 B are written in bytes (`600 B`), the rest in kB (`4.35 kB`).

**Optional Gzip twins.** Gzip is noisier-proof than Brotli at small sizes, so a Gzip entry for the same bundle gives a second, steadier signal when a Brotli number moves ambiguously. This doubling is opt-in — only for projects that track size strictly. When used, each entry exists twice, `<name> (Gzip)` with `"gzip": true` and `<name> (Brotli)` without it, so both numbers are visible for the same bundle:

```json
[
  {
    "name": "Signal (Gzip)",
    "gzip": true,
    "path": "dist/index.js",
    "import": "{ signal }",
    "limit": "1.45 kB"
  },
  {
    "name": "Signal (Brotli)",
    "path": "dist/index.js",
    "import": "{ signal }",
    "limit": "1.35 kB"
  }
]
```

## Keeping limits current

**After a change that can affect the output, rebuild and re-pin the limits.** How often depends on the user's workflow — at most after every edit, at minimum before every commit run the build and update the configs. In a monorepo, base packages are bundled into dependents at measure time, so a change in a base package moves the numbers of the whole chain, not just its own package — rebuild the chain first:

```sh
pnpm -r --filter './packages/*' build     # sequentially, never --parallel
# then, per package with a .size-limit.json — via the package script if it has one:
pnpm test:size   # or: npx size-limit --json
```

Re-pin each changed entry from the measured size using the 0.05 kB rounding rule above. A limit that went **up** is a size regression — surface it to the user rather than silently raising the number.
