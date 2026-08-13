---
name: tree-shaking
description: Practices for writing tree-shakeable JavaScript/TypeScript library code — a consumer must pay only for what they import. Mandatory rules (pure annotations, side-effect-free modules, honest sideEffects, ESM-only) apply to all library code always; architecture tricks (plugin registries, lazy hooks, settings-as-functions, size-limit contracts) apply on user request.
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
    - tree-shaking
    - bundle-size
    - javascript
    - typescript
    - library
---

# Tree-Shaking

Goal: a consumer pays only for what they import. Everything below serves that.

This skill has two parts:

- **Always** — rules to follow in any library code, without being asked. Violating them silently pins dead code into every consumer bundle.
- **On request** — architecture tricks. Apply them when the user asks to make an API tree-shakeable, reduce bundle size, or design a new library surface.

## Always

### `/* @__NO_SIDE_EFFECTS__ */` on function declarations

Put it on every exported (and shared internal) function that is free of observable side effects. It tells the bundler that any call to this function can be dropped when its result is unused — one annotation covers every call site, including consumer code.

```ts
/* @__NO_SIDE_EFFECTS__ */
export function signal<T>(value?: T): WritableSignal<T | undefined> {
  return createSignal(signalOper, { /* ... */ })
}
```

It also belongs on functions that technically **do** mutate something, but whose mutation is pointless if the returned value is thrown away — if dropping the call cannot be observed, mark it:

- registering an entry in a registry that can only ever be looked up via the returned key;
- filling a cache nobody will read (`$source.record ??= new Proxy(...)`);
- attaching lifecycle callbacks to an object nothing else references:

```ts
/* @__NO_SIDE_EFFECTS__ */
export function interval(ms: number): WritableSignal<number> {
  const $interval = mountable(signal(0))
  onStart($interval, () => {
    const timer = setInterval(() => $interval($interval() + 1), ms)
    return () => clearInterval(timer)
  })
  return $interval
}
```

Do **not** mark functions with genuinely observable effects (`effect()`, DOM writes, subscriptions to external state) — the annotation is a claim, and a false claim makes bundlers silently delete live code.

### `/* @__PURE__ */` on module-root calls

Required for **every** function or class call (including `new`) evaluated at module root. Without it a module-level call is treated as a side effect and pins everything it touches into every bundle that imports the module, however little of it is used.

```ts
export const a = /* @__PURE__ */ createElementFactory('a')
export const abbr = /* @__PURE__ */ createElementFactory('abbr')
const reactiveAttributes = /* @__PURE__ */ new Set(['href', 'src'])
const flatHandler = /* @__PURE__ */ createProxyHandler(child => child)
```

Applies to third-party calls too (`/* @__PURE__ */ createContext(...)`). If the callee is already marked `@__NO_SIDE_EFFECTS__`, the call-site annotation is technically redundant — the two are complementary and either one suffices — but annotating the call site anyway is the safe default.

### No side effects at module level

Beyond annotated calls, a module top level must contain only declarations. Concretely:

- No imports-for-effect (`import './setup'`) in shakeable code.
- Module-level mutable state starts as a bare `let x: T | undefined` (free to declare) and is lazily initialized (`x ??= new Set()`) inside the function that needs it — not `const x = new Set()` eagerly.
- Barrel files (`index.ts`) are **pure re-exports only**: no constants, no initialization. Use `export type * from './types.js'` for type-only modules so they are erased at compile time instead of left for the bundler to reason about.

### Honest `sideEffects` in package.json

Every publishable package sets `"sideEffects": false` — **if it is true**. It is a claim, not a decoration:

- If an entry genuinely installs something at import time (e.g. a framework adapter that patches a hook on import), declare `"sideEffects": true` (or list the specific files in an array). Lying lets bundlers drop the whole module.
- CSS or polyfill files that must survive go into the array form: `"sideEffects": ["./dist/index.css"]`.

### ESM-only, statically analyzable output

- `"type": "module"`, `exports` map only; no CJS build, no legacy `main`/`module` fields. Bundlers can only tree-shake statically analyzable ESM.
- Build with a modern target (`esnext`) so no transpile helpers or `Object.defineProperty` shims appear — they defeat static analysis. Beware transpiler class transforms that break `@__PURE__`.
- Publish **unminified** dist (`minify: false`) so the annotations survive into `node_modules`; minification is the consumer's job.
- In a monorepo, externalize workspace dependencies in each package's build config instead of bundling them in — one shakeable module graph, no duplicated copies.

### No TypeScript `enum`

`enum` emits a runtime IIFE object — unshakeable and non-inlinable; `const enum` breaks `isolatedModules`. Use plain `const` numbers/strings (bit flags as `1 << n`), which minify to inlined literals:

```ts
export const NoneFlag = 0
export const MutableFlag = 1 << 0
export const MountableMode = 1 << 3
```

### Named exports, functions over methods

- Export individual named functions, not a default-exported monolith.
- Never make prototype methods the API surface: methods can't be tree-shaken, so a class with `.map()`, `.filter()`, `.subscribe()` ships all of them to every consumer. Expose standalone functions operating on the value instead. Classes are acceptable only where the whole unit is always used together and is off the size-critical path (e.g. an SSR renderer); for variants, prefer injecting a behavior function or `Object.create(base)` forking over subclassing.

## On request

Tricks to apply when the user asks to design a tree-shakeable API, shrink a bundle, or restructure a library.

### Plugin registry instead of a monolithic dispatcher

A `switch` over features references every implementation and is unshakeable. Instead, make every feature an independently importable const whose value is just its id, registered as a side effect of creating that const — implementation reachable only through the import:

```ts
export const effectAttributes = new Map<string, EffectAttributeCallback>()

/* @__NO_SIDE_EFFECTS__ */ // registering an entry nobody can name is unobservable
export function createEffectAttribute(id: string, callback: EffectAttributeCallback) {
  effectAttributes.set(id, callback)
  return id
}

// feature module — importing `classList$` is what pulls the implementation in
export const classList$ = /* @__PURE__ */ createEffectAttribute('classList$', (element, value) => { /* ... */ })
```

Attach the feature's types via `declare module '...'` augmentation — zero runtime cost. Chart.js's `Chart.register(...)` is the same idea: consumers register only what they use.

### Lazy self-installing hooks

When a core needs an optional subsystem (lifecycle, dev extensions), don't call `install()` unconditionally. Keep `undefined`-initialized module-level hook slots and assign them only from a code path reachable exclusively via the optional public API:

```ts
let lifecycleEdge: ((dep: Node, sub?: Node) => void) | undefined
let lifecycleSettle: (() => void) | undefined

// reachable only via mountable()/onMounted() — apps that never mount drop the whole subsystem
export function touchLifecycle(node: Node): void {
  lifecycleEdge = onEdge
  lifecycleSettle = settle
  settle()
}
```

Hot paths pay only `lifecycleSettle?.()`. If nothing imports the optional API, `onEdge`/`settle` and everything they reference disappear.

### Descriptors that carry their own implementation

Instead of a central runner that switches over descriptor kinds (referencing every handler), return plain objects holding a reference to their own handler — importing `title()` pulls in only `startProperty`:

```ts
/* @__NO_SIDE_EFFECTS__ */
export function title($value: TitleValue): TitlePropertyDescriptor {
  return { tag: 'title', value: $value, start: startProperty }
}
```

### Settings as functions instead of an options object

An options object `{ dedupeTime, cacheTime, mapError }` forces one parser that touches every option. Individual closure factories let unused options vanish:

```ts
/* @__NO_SIDE_EFFECTS__ */
export function dedupeTime(time: number): ClientSetting {
  return ctx => ctx.dedupeTime = time
}
```

### `bind()` as a factory primitive

`fn.bind(null, arg)` produces a specialized function without a new function body, and combined with `@__NO_SIDE_EFFECTS__` on the factory it is a fully droppable expression:

```ts
/* @__NO_SIDE_EFFECTS__ */
export function createElementFactory<Tag extends ElementName>(tag: Tag) {
  return createElement.bind(null, tag) as ElementFactory<Tag>
}
```

### Subpath exports for genuinely separable chunks

When a package has environment-specific or clearly separable parts, give them their own `exports` entries with no shared root so, e.g., server-only code can never be reached from a client import path:

```json
"exports": {
  ".": "./dist/index.js",
  "./vite-plugin": "./dist/vite-plugin.js",
  "./renderer": "./dist/renderer.js",
  "./client": "./dist/client.js",
  "./package.json": "./package.json"
}
```

### Pin tree-shakeability with size-limit

Annotations rot unless tested. Set up size-limit checks by following the `size-limit` skill. The tree-shaking-specific point: measure several **import subsets** of the same dist file (e.g. `{ signal }`, `{ signal, computed, effect }`, `*`), so a shakeability regression shows up as a specific entry blowing its limit rather than a vague total — the delta between subsets is the size of the subsystem being measured as droppable.

For one-off checks of a tricky expression, use locally available tools (rollup/rolldown/terser). Write a tiny entry that imports the module but leaves the result unused, bundle it, and check what survives:

```bash
echo "import { thing } from './dist/index.js'" > /tmp/entry.js
npx rollup /tmp/entry.js --silent --format es # empty output = fully dropped
# or: npx rolldown /tmp/entry.js --silent
# or pipe a single expression through the minifier:
echo "const x = /* @__PURE__ */ create();" | npx terser --module --compress --toplevel
```
