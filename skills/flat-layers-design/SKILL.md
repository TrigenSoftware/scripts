---
name: flat-layers-design
description: Flat Layers Design (FLD), the folder structure and layering rules for simple frontend apps, framework-agnostic — app/ split into shared, services, stores, uikit, blocks and pages, each a flat list of modules with a one-way dependency direction. Covers what goes where, naming, imports, stories/tests placement and the steps to add a feature. Apply when scaffolding a new app, adding a feature, or deciding where a file belongs.
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
    - architecture
    - project-structure
    - frontend
    - layering
---

# Flat Layers Design

Flat Layers Design (FLD) splits the app into layers by *role* (what a module is), not by feature. Every layer is a flat list of modules, and dependencies point one way only. This is the structure for small and medium apps (SPA or SSR, one team). It deliberately does not slice layers by domain — see [When it grows](#when-it-grows).

Component-level conventions (folder per component, props, stories) live in the framework-agnostic `ui-component` skill and framework skills such as `react-component`; this skill only says which folder a module belongs to and what it may import.

The trees below are taken from a React + Vite app, so they show `.tsx` components, `*.stories.tsx` and hooks. With another framework keep the layout and swap the file types and idioms (`.vue`, `.svelte`, composables…).

## Layout

```
index.html         — CSR only: loads /app/index.tsx and /app/styles.css
scripts/           — build helpers (svg-sprite.js, precompress.js)
.storybook/        — main.ts (stories glob ../app/**/*.stories.*), preview.ts (imports app/styles.css)
app/
  index.tsx        — entry point: mounts the app (CSR) or exports the routes → pages tree (SSR)
  server.ts        — SSR server (optional)
  styles.css       — global CSS entry: normalize, fonts, uikit/variables.css, uikit/globals.css
  vite-env.d.ts    — Vite env typings (ImportMetaEnv)
  oxlint.config.ts — browser-env lint config extending the root one (optional)
  assets/          — favicon.svg, logo.svg, fonts/, icons/*.svg → sprite.svg
  shared/          — app-wide constants, types, pure utils
  services/        — data access and domain logic: API clients, adapters, types, mocks
  stores/          — application state: one file per domain + router, query, intl
  uikit/           — presentational components and design tokens
  blocks/          — business blocks: uikit + stores composed into features
  pages/           — route pages and layouts
```

Source lives in `app/`, not `src/`. The `~` alias points to `app/` (`resolve.alias` in Vite, `paths` in tsconfig).

## Dependency direction

```
pages ──► blocks ──► uikit
  │          │
  ▼          ▼
stores ──► services ──► shared
```

| Layer | May import | Must not import |
|-------|------------|-----------------|
| `shared` | packages only | any app layer |
| `services` | `services`, `shared` | `stores`, `uikit`, `blocks`, `pages` |
| `stores` | `stores`, `services`, `shared` | `uikit`, `blocks`, `pages` |
| `uikit` | `uikit`, `assets`, `shared` | `stores`, `blocks`, `pages`; `services` only as a `type` import, and only when the type can't reasonably be declared in `uikit` |
| `blocks` | `blocks`, `uikit`, `stores`, `services`, `shared` | `pages` |
| `pages` | everything | — |

Blocks and pages take from `services` only types, error codes, constants and pure helpers; queries and mutations go through `stores`.

## Where does it go?

| You have… | Put it in |
|-----------|-----------|
| a visual element with no copy and no data knowledge | `uikit/<Name>/` |
| a component that reads a store, has copy, or collects analytics | `blocks/<Name>/` |
| a sub-part used by one block only | inside that block: `blocks/<Name>/<Part>.tsx`, `blocks/<Name>/types/` |
| a helper, hook/composable or messages factory used by 2+ blocks | `blocks/shared/<domain>.ts` |
| a screen bound to a route, or a layout | `pages/<Name>/` |
| a route path | `stores/router.ts`, then register the page in `index.tsx` |
| domain state, derived state, queries, mutations, redirects after actions | `stores/<domain>.ts` |
| an API call, wire ↔ domain mapping, domain error codes | `services/<domain>/` |
| domain logic without external I/O (password policy, document parsing, image URL building) | `services/<domain>/` too — it is still a service |
| a pure util with no domain (array, date, hashing) | `shared/utils/<topic>.ts` |
| an app-wide constant or type | `shared/constants.ts`, `shared/types.ts` |
| a design token, breakpoint, mixin, typography class | `uikit/variables.css`, `media.css`, `mixins.module.css`, `typography.module.css` |
| an icon | `assets/icons/<name>.svg`, then rebuild `sprite.svg` (see `svg-sprite-icons`) |
| a translation | `services/intl/translations/<locale>.json` |

## Layers

### `shared/`

```
shared/
  constants.ts   — INPUT_DELAY, SECOND, MINUTE…
  types.ts       — app-wide types not owned by a domain
  utils/
    index.ts     — re-exports
    array.ts  dateTime.ts  number.ts  sha256.ts   — one file per topic
```

Imports nothing from the app. In a tiny app this collapses into a single `app/constants.ts`.

### `services/`

Data access and domain logic. No state, no UI, no imports from the component framework.

```
services/
  api/
    index.ts             — export * from './api', './api.types', './causeFromResponse'
    api.ts               — ApiService interface + env switch (SSR → server, else client)
    api.client.ts        — browser fetch wrapper (relative /api/ base)
    api.server.ts        — SSR fetch wrapper (absolute host, forwards cookies / Accept-Language)
    api.mock.ts          — in-memory mock API assembled from the domain *.mock.ts modules
    api.types.ts         — HttpStatus, Page<T>, PageParams
    causeFromResponse.ts — builds Error `cause` from a failed Response
  mock/db.mock.ts        — in-memory collections used by the mocks
  intl/                  — IntlService + translations/<locale>.json
  logger/                — LoggerService
  garden/                — a domain, see below
  plant/  post/  report/  user/  image/  audio/  document/  password/
```

A domain folder:

```
services/garden/
  index.ts           — export * from './garden' and './garden.types' (never the mock)
  garden.ts          — GardenService: one method per endpoint; throws GardenError codes
  garden.types.ts    — RawGarden (wire shape), Garden (domain shape), GardenParams, GardenError
  garden.adapter.ts  — unpackGarden(raw) / packGarden(params) — the only place that knows both shapes
  garden.mock.ts     — seed(db) + routes(app, db) for the mock API
  garden.adapter.spec.ts — tests for adapters and other pure logic
```

- Error codes are a `const` object of string constants; the service throws `new Error(GardenError.NotFound, await causeFromResponse(response))`. UI maps codes to messages, never reads `error.message` as copy.
- `Raw*` types mirror the wire format; everything above `services` sees only domain types.
- A service does not need external I/O to be a service. Image URL building (`image/imageUrl.ts`), password policy (`password/password.ts`), document parsing (`document/`) work with domain data and carry business rules, so they are services here, not `shared/utils`; both stores and blocks may use them.
- In a tiny app a domain is two flat files: `services/<domain>.ts` + `services/<domain>.types.ts`.

### `stores/`

One file per domain plus infrastructure stores. camelCase file names — these are not components.

```
stores/
  router.ts   — routes map, public-routes set, route params
  query.ts    — query/cache client setup (dedupe, SSR, error logging), if a query library is used
  intl.ts     — locale + message loading
  user.ts  garden.ts  plant.ts  post.ts  report.ts   — domain stores
```

A store holds the state and the actions of its domain (for `garden`: the current garden, its loading and error state, `createGarden`, `deleteGarden`), reads services for data and other stores for context (`./router` params, `./query` client). The state library is not prescribed (signals, atoms, observables, a query client); whatever it is, the store is the only layer that calls service methods, and navigation side effects of an action (redirect after login, go to the created entity) live in the store, not in the block.

### `uikit/`

The UI kit tier (see `ui-component`, and framework skills such as `react-component`): no copy, no stores, no business logic; labels come through props. Root files are the design system:

```
uikit/
  variables.css          — design tokens as CSS custom properties (colors, fonts, sizes, durations, shadows)
  globals.css            — element defaults (body, a); the only global styles besides styles.css
  media.css              — @custom-media breakpoints (--screenSm, --screenMd, --screenReducedMotion…)
  mixins.module.css      — classes meant for `composes` (see css-mixin skill)
  typography.module.css  — h1/h2/text/muted/link classes + typography.stories.tsx
  types.ts               — ElementType, AsElementProps<T> for polymorphic `as` components
  hooks.ts               — generic UI hooks/composables (e.g. useFormValidity, useTextBlink), optional
  Icon/                  — sprite icon component (svg-sprite-icons skill)
  Button/  Input/  Form/  FormGroup/  Text/ …
```

### `blocks/`

The business-logic tier: a block composes uikit components with stores and owns its copy. One folder per block, structured per the component skill of the framework (e.g. `react-component`). Extra files stay inside the block until another block needs them:

```
blocks/
  shared/
    messages.ts      — message sets used by many blocks (common, password…)
    garden.ts  post.ts  report.tsx  image.ts   — per-domain helpers: messages, hooks/composables, render helpers
  GardenForm/
    index.ts
    GardenForm.tsx
    GardenForm.stories.tsx
    GardenFormLinks.tsx   — sub-component used only here
  ReportFormModal/
    ReportFormModal.tsx
    messages.ts           — block's messages factory when several files need it
    VoiceField.tsx
    types/                — one file per variant (water.tsx, pest.tsx…) + index.tsx
```

- Blocks may use other blocks (`../GardenLinks`).
- `blocks/shared/` files are named by domain, not by kind (no `hooks.ts`, `utils.ts` dumps).
- Each block has its own translation namespace, camelCase block name (`gardenCard`, `loginForm`); the block's messages are declared privately in the block file, or in `messages.ts` when several files of the block need them.

### `pages/`

One folder per route plus layouts. A page composes blocks and uikit; its own CSS is only layout (grid, spacing between blocks).

```
pages/
  shared/messages.tsx   — page-level messages: titles, breadcrumbs shared by pages
  RootLayout/           — head/meta, link behaviour; renders the child route outlet
  AppLayout/  AuthLayout/   — layouts with chrome (header, nav) — or a single Layout/
  Home/
    index.ts            — export * from './Home'; export { Home as default } from './Home'
    Home.tsx
    Home.module.css
```

- `index.ts` also re-exports the component as `default` so `index.tsx` can lazy-load pages; this is the only place default exports are allowed (lint override for `pages/*/*`).
- A router with SSR preloading may require extra named exports next to the component. E.g. with `@nano_kit/react-router` a page/layout module exports `Stores$()` (own messages + spread of its blocks' `*Stores$`) and `Head$()` (title, meta), and blocks export a matching `<Block>Stores$()`.
- Page translation namespaces: `<name>Page` (`homePage`, `gardenPage`) or the shared `pages`.

### Entry points

- **CSR:** `index.html` → `app/index.tsx` mounts the app (e.g. `createRoot` in React); the routes → pages tree lives in `app/App.ts`.
- **SSR:** `app/index.tsx` exports `routes` and the `pages` tree (e.g. `layout(RootLayout, [page('home', loadable(() => import('./pages/Home'), AppLoader)), …])`); `app/server.ts` is the HTTP server (Hono); the SSR Vite plugin points at both.

## Import conventions

- Cross-layer imports go through the alias: `~/uikit/Button`, `~/stores/garden`, `~/services/garden`.
- Same-layer imports are relative: `../shared/messages`, `../GardenLinks`, `../Text`, `./router`.
- Import through the folder's `index.ts`. Deep imports are reserved for opt-in entry points: `~/uikit/RichTextEditor/loadable`, `~/services/api/api.mock`.
- Order inside a file: packages → `~/…` → relative → the CSS module last.

## Stories and tests

- `*.stories.tsx` and `*.spec.ts(x)` sit next to the code they cover; the Storybook glob is `app/**/*.stories.*`.
- Story title's first segment is the layer: `uikit/Button`, `Blocks/GardenCard`, `Pages/Home`.
- uikit stories are pure. Block and page stories provide the mock API (`MockApiService`) and a virtual navigation (through DI context, decorators or store setup), so the block runs against `services/*/*.mock.ts` data.
- Tests concentrate in `services` (adapters, parsers, pure rules) and uikit utils; blocks and pages are covered by stories.

## Adding a feature

1. `services/<domain>/` — types (`Raw*` and domain), service methods, adapter, mock routes + seed; export from `index.ts`.
2. `stores/<domain>.ts` — state, queries, mutations, redirects.
3. `uikit/` — new presentational pieces, if the existing kit lacks them.
4. `blocks/<Name>/` — the feature UI over the store; translations into `services/intl/translations/*.json`.
5. `stores/router.ts` — route; `pages/<Name>/` — page; register it in `index.tsx`.
6. Stories for the block and page; specs for the adapter.

## When it grows

- Keep layers flat. Cross-cutting code goes to `<layer>/shared/<domain>.ts`, not to nested feature folders.
- Sub-components and variants stay inside their block (`Block/Part.tsx`, `Block/types/`); promote to a separate block only when a second consumer appears.
- A domain service that outgrows one file splits by file suffix (`.types`, `.adapter`, `.mock`), not into sub-folders.
- When a layer stops fitting on one screen, that is the signal the app has outgrown this structure and layers need slicing by domain — out of scope here.
