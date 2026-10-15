---
name: storybook
description: Framework-agnostic conventions for Storybook in Trigen-style projects. Covers the .storybook setup, colocated stories with layer titles, meta args and controls, which stories to write, the container a story gives its component, decorators that give blocks and pages their stores, routes and mock API, stories reused in tests, and a toolbar toggle between the light and the dark theme. Apply when setting up Storybook, writing, editing, or reviewing stories, or adding a theme switcher to the preview.
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
    - storybook
    - stories
    - ui
    - components
    - testing
---

# Storybook

These conventions hold for any renderer. How a `render` or a decorator builds its markup and how `meta` is typed belong to the framework's component skill (`react-component`, `nanoviews-component`), and the renderer API to its own skill (`nanoviews-storybook`) or the Storybook docs. The components themselves follow `ui-component`.

The examples import the config types from `@storybook/your-framework` and the story API from `@storybook/your-renderer`, the way the Storybook docs write it. Put the project's packages there: `@storybook/react-vite` and `@storybook/react`, or `@nanoviews/storybook-vite` and `@nanoviews/storybook`.

## Setup

```
.storybook/
  main.ts      the framework and the stories glob
  preview.ts   what every story gets: global styles, parameters, globals, decorators
  preview.css  styles of the preview frame alone (optional)
```

```ts
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/your-framework'

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../app/**/*.stories.tsx']
}

export default config
```

- **Next to the components.** `.storybook/` sits in the package that owns them: the app root, or the package of a monorepo.
- **The Vite framework of the renderer.** Storybook then builds the stories with the project's own `vite.config`, so aliases, CSS Modules and plugins work as in the app. A plugin meant for the library build alone guards itself with `apply`, and `viteFinal` changes only what Storybook really needs, with a comment saying why.
- **One glob** over the source root, `app/` in an app (`flat-layers-design`) or `src/` in a package, with the stories extension of the project.
- **No `addons` list.** Controls, actions, toolbars, viewport and backgrounds come with Storybook itself. An addon comes in for a concrete need.

```ts
// .storybook/preview.ts
import type { Preview } from '@storybook/your-renderer'
import '../app/styles.css'

const preview: Preview = {}

export default preview
```

- **The preview recreates what the app's entry puts around its components, and nothing more:** the global stylesheet (normalize, fonts, tokens, globals), the theme root, the inline icon sprite if the app injects one, the document `lang` if the app is not in English. A story then looks the way the component does in the app.
- **No `controls.matchers` from the scaffold.** Controls are declared in `argTypes`, and the scaffold's `color` matcher turns a `color` variant into a color picker.

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006 --no-open",
    "build:storybook": "storybook build",
    "clear": "del ./dist ./coverage ./storybook-static"
  }
}
```

- `storybook-static` is in `.gitignore`, and `clear` removes it.
- `.storybook/*.ts` is in the `include` of `tsconfig.json`, so the config is type-checked with the app. Stories are linted with the `storybook` preset of `@trigen/oxlint-config` (or `@trigen/eslint-config`), which allows default exports, magic numbers and `any` there.
- Stories stay out of what a package ships and measures: `**/*.stories.ts` and `**/*.mock.ts` in the `exclude` of `tsconfig.build.json`, stories in the coverage `exclude` of Vitest.
- CI runs `pnpm build:storybook` on pull requests, so a story that no longer builds fails the check. An app can also publish the build, for example to GitHub Pages.
- A story that needs a secure context on another device, such as the microphone of a phone in the local network, gets a `storybook:https` script: `storybook dev -p 6006 --no-open --https --ssl-cert .storybook/certs/cert.pem --ssl-key .storybook/certs/key.pem`, with `.storybook/certs` in `.gitignore`.

## Story files

- **One stories file per component, next to it:** `Button/Button.stories.tsx` beside `Button.tsx`, in the folder structure of the component skills. Every uikit component, block and page has one. The parts of a compound component (`Tabs` and `Tab`, `Window` and its bars) appear in the stories of the whole, not in files of their own.
- **Styles without a component** get stories next to their module, named like it: `uikit/typography.stories.ts` beside `typography.module.css`, with a story that shows every class.
- **A library** keeps one stories module per source module: `flow/if.stories.ts` beside `flow/if.ts`.
- **Every named export of a stories module is a story.** Fixtures and decorators that several stories or specs share live in `*.mock.ts` modules: `blocks/shared/app.mock.ts`, `services/garden/garden.mock.ts`.

## Titles

Every title is explicit, `<Layer>/<Name>`: the layer in PascalCase, the name exactly as the component is exported.

```ts
title: 'UIKit/Button'
title: 'Blocks/GardenCard'
title: 'Pages/Home'
```

A library groups its modules by area: `Component/Context`, `Elements/Shadow DOM`.

## Meta

```ts
// IconButton.stories.ts
import type {
  Meta,
  StoryObj
} from '@storybook/your-renderer'
import { fn } from 'storybook/test'
import { icons } from '../Icon'
import { IconButton } from './IconButton'

const meta = {
  title: 'UIKit/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    icon: {
      control: 'select',
      options: icons
    },
    label: {
      control: 'text'
    },
    pressed: {
      control: 'boolean'
    },
    disabled: {
      control: 'boolean'
    }
  },
  args: {
    icon: 'pause',
    label: 'Pause the log',
    pressed: false,
    disabled: false,
    onClick: fn()
  }
} satisfies Meta<typeof IconButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** The log is paused: aria-pressed says so, not only the color */
export const Pressed: Story = {
  args: {
    pressed: true
  }
}

export const Disabled: Story = {
  args: {
    disabled: true
  }
}
```

- **`component` comes first when the component takes props alone:** the renderer renders it from args, and a story that only picks args is `{}` or `{ args }`. A complex example, such as a composition, gets a `render` instead, and so does a nanoviews component with children, which are not props there.
- **`args` give every arg its default,** so each story starts from a complete set and changes only what it is about.
- **`argTypes` give a control to every arg worth playing with,** and the arg goes into the component as it is: `select` (or `inline-radio` for two or three values) with `options` for a union, `boolean`, `text`, `number`, `range` with `min`, `max` and `step`, `object`. The `options` come from a typed constant, the one the component exports (`icons`) or one at the top of the module (`TONES`), never an inline list that drifts from the type. A "none" option maps to `undefined` through `mapping`, or the arg defaults to `null`.
- **`parameters.controls.exclude`** hides a control that does nothing in a given story.
- **`parameters.layout`:** `centered` for controls and widgets, which is most of the UI kit; `padded`, the default, for what spans a column, such as a page header or a list; `fullscreen` for what sets its own width and margins in the app: pages, app shells, a block shown inside the app frame.
- **The typing of `meta` is the framework skill's business:** `satisfies Meta<typeof IconButton>` above, `Meta<Args>` where the renderer can't infer the args from the component. Always `export default meta` and `type Story = StoryObj<typeof meta>`.

## Stories

- **`Default` comes first:** the meta args as they are, `{}`. A component whose base state has a more telling name starts with that one (`Empty`, `Unchecked`).
- **One story per state or variant a reviewer must see without touching the controls,** named in PascalCase after what differs, not after a prop. The names in use:
  - variants: `Primary`, `Subtle`, `Danger`, `Large`
  - states: `Disabled`, `Invalid`, `Busy`, `Loading`, `Empty`, `Filled`, `Failed`
  - content: `WithIcon` and `WithoutHint`, `LongTitle`, `ManyItems`, domain cases such as `NotAZip`
  - context: `InList`, `InForm`, `InPanel`, for the component inside the consumer it is made for
- **Stress cases get stories of their own:** long words and long text, an empty list, many items, a missing picture, copy in another language with its `lang`. A story name never shadows a global: `Failed` or `WithError`, not `Error`.
- **An overview story** (`Tones`, `Sizes`, an icon `Gallery`) puts a whole set side by side, in a flex or grid row with a gap, when the set is compared at a glance. Other variants get a story each.
- **A shared `render` goes to the meta** when `component` is not enough (a complex example, children in nanoviews) and the stories differ only in args or decorators. A story's own `render` is for a different composition.
- **Props that are not controls** (a fixed `id`, `accept`, a child the story needs) are set in `render` beside the spread args, with a comment when the reason is not obvious.
- **A JSDoc line** goes above a story whose point its name does not tell, as "condition: what to see", often naming what the keyboard or a screen reader gets: `/** One option unavailable: the arrow keys pass over it */`. Why the component is designed the way it is goes in a comment beside its code, not in stories.
- **No MDX and no autodocs.** The stories and their JSDoc are the documentation.

### Content and fixtures

- **Real copy:** the product's wording and realistic domain data, never lorem ipsum or "Button text".
- **Typed fixtures:** built with the app's types and helpers, as SCREAMING_CASE constants at the top of the module, or in a `*.mock.ts` once stories or specs share them. Their ids match the seed of the mock API.
- **Deterministic:** fixed dates, ids and seeds, no `Date.now()`, `Math.random()` or unseeded faker, so every render and every screenshot is the same.
- **Offline:** images are SVG data URLs, and binary inputs are made in code (a PNG drawn on a canvas, a zip `File` built by a helper), never network URLs or asset files kept for the stories.

### The container and the surroundings

- **A component gets the container it has in the app.** By the `ui-component` rules a block sets no outer geometry, so the meta `decorators` wrap it in an element of the width it has in the app, fluid enough to fit a 320px viewport: `inline-size: min(320px, calc(100vw - 32px))`. A component that fills its container gets a height too, and a block of a page column takes the column token: `max-inline-size: var(--sizeContent)`. A comment says where the width comes from. Inline styles, with logical properties and tokens, belong to these wrappers only.
- **Floating UI is shown open,** with room around the anchor for the popover or tooltip to unfold. A dialog story opens it on mount and keeps the button that opens it again.
- **A controlled component keeps its value in the args:** the story's handler writes the new value into the arg (`useArgs` in React, the writable arg signal in nanoviews) and calls the `fn()` spy. The component then works, the Actions panel logs and the Controls panel shows the current value.
- **Accessible as in the app:** a standalone control gets its `aria-label` arg, and a composition wires `id`, `for` and `aria-describedby` the way the real form does.
- **Nothing leaves the preview:** a link goes through the story's virtual navigation, and a plain link or a form submit gets a handler that calls `preventDefault()`.

## Actions

- **Every handler arg gets `fn()`** from `storybook/test` in the meta `args`, as `onClick` in the example above. The Actions panel logs its calls, and a spec that renders the composed story passes its own spy instead.
## Blocks and pages

UI kit stories need nothing but args. Blocks and pages read stores rather than props, so their stories give them the app around them, and a story's state comes from the route and the data, not from args.

With nano_kit DI the stores reach the outside world through injected services, so a story provides mocks of those services and runs the real stores on them (`nano-kit-store`). A factory in a shared mock module builds the decorator that opens the injection context of the story: the mock API in place of the real one, and a virtual navigation at the story's route (`nano-kit-react-router`).

```tsx
// blocks/shared/app.mock.tsx
import type { Decorator } from '@storybook/your-renderer'
import { InjectionContextProvider } from '@nano_kit/react'
import {
  LocationNavigation$,
  virtualNavigation
} from '@nano_kit/router'
import { provide } from '@nano_kit/store'
import { ApiService$ } from '~/services/api'
import { MockApiService } from '~/services/api/api.mock'
import { routes } from '~/stores/router'

export interface MockAppOptions {
  /** The route the story opens at, built by the paths of the router */
  path: string
  /** Sign in before the first render */
  authenticated?: boolean
}

/**
 * Runs the story in the app around it: the real stores on the mock API,
 * at the route of the story.
 * @returns The decorator.
 */
export function withApp({
  path,
  authenticated = true
}: MockAppOptions): Decorator {
  // Made once per story, not per render: a control edit keeps the data
  const apiService = new MockApiService()
  const context = [
    provide(LocationNavigation$, virtualNavigation(path, routes)),
    provide(ApiService$, apiService)
  ]

  if (authenticated) {
    apiService.auth()
  }

  return Story => (
    <InjectionContextProvider context={context}>
      <Story />
    </InjectionContextProvider>
  )
}
```

```tsx
// AppHeaderNav.stories.tsx
import type {
  Meta,
  StoryObj
} from '@storybook/your-renderer'
import { buildPaths } from '@nano_kit/router'
import { routes } from '~/stores/router'
import { withApp } from '../shared/app.mock'
import { AppHeaderNav } from './AppHeaderNav'

const paths = buildPaths(routes)
const meta = {
  title: 'Blocks/AppHeaderNav',
  component: AppHeaderNav,
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof AppHeaderNav>

export default meta

type Story = StoryObj<typeof meta>

export const SignedIn: Story = {
  decorators: [
    withApp({
      path: paths.home
    })
  ]
}

export const SignedOut: Story = {
  decorators: [
    withApp({
      path: paths.home,
      authenticated: false
    })
  ]
}
```

In nanoviews the factory opens the context with `context$` (`nanoviews-storybook`). A nanoviews story mounts once, so the decorator itself makes the app, fresh on every mount:

```ts
// blocks/shared/app.mock.ts
export function withApp({
  path,
  authenticated = true
}: MockAppOptions): Decorator {
  return (story) => {
    const apiService = new MockApiService()

    if (authenticated) {
      apiService.auth()
    }

    return context$(
      provide(LocationNavigation$, virtualNavigation(path, routes)),
      provide(ApiService$, apiService)
    )(
      story()
    )
  }
}
```

- **Decorators provide the app:** the DI context with the stores, a virtual navigation at the route the story needs, the mock API. Pages render at the story's route the way the router renders them in the app, with `layout: 'fullscreen'`. App code does not branch on `import.meta.env.STORYBOOK`: what differs in Storybook comes through decorators and DI.
- **Every story gets a fresh app.** A factory builds the decorators per story, `context({ failing, pending })` or `withGame(archive)`, so no story hands its data, cookies or session to the next. A decorator that has to write module-level state restores it on unmount.
- **A meta decorator can read the story's `parameters`:** `withMockApp()` in the meta and `parameters: { select: ctx => ctx.$total }` in each story make stories differ by data without a decorator each.
- **Mock at the I/O edge.** The decorators replace only the services that reach the outside world, such as the API. The stores and the pure services run for real.
- **Loading and failure are data states:** `Loading` gets a fetch that never settles, `Failed` one that answers 500, and a retry story one that fails twice and then succeeds.
- **Reach a state the way the app does:** call the store's action with realistic input (sign in, load the archive) rather than writing its state, unless the state can't be reached that way, such as a build in progress. A decorator that sets the state up asynchronously renders the story once it is ready, so the first frame is the state under review.
- **Browser APIs** the story can't use for real are stubbed in its `beforeEach`, which returns the cleanup.
- **Decorator order:** the first decorator of an array is the innermost, and story decorators run inside the meta's, which run inside the preview's. A decorator that needs the app (signs in, opens a dialog) comes before the one that builds it: `decorators: [withReading(), withGame(null)]`.

## Stories in tests

Stories have no `play` functions: behavior is asserted in `*.spec.ts` by the `unit-tests` conventions. A spec that needs the setup a story already has renders the composed story instead of building the view again. The story comes with its args and decorators, and the test passes the args it drives.

```ts
// if.spec.ts
import { composeStories } from '@storybook/your-renderer'
import * as Stories from './if.stories'

const {
  StaticValue,
  ReactiveValue
} = composeStories(Stories)
```

## Light and dark theme

When the UI has both themes, a toolbar toggle switches the whole preview frame between them. The tokens follow `ui-component`: their `light-dark()` pairs follow the system, and the decorator forces the scheme of the toolbar on the root element.

```ts
// .storybook/preview.ts
import type {
  Decorator,
  Preview
} from '@storybook/your-renderer'
import '../app/styles.css'
import './preview.css'

// The page follows the color scheme of the system: the toolbar forces one on the root instead,
// so the whole preview frame follows the toggle
const withTheme: Decorator = (story, context) => {
  document.documentElement.style.colorScheme = String(context.globals.theme)

  return story()
}
const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Theme',
      toolbar: {
        icon: 'mirror',
        items: [
          {
            value: 'light',
            title: 'Light'
          },
          {
            value: 'dark',
            title: 'Dark'
          }
        ],
        dynamicTitle: true
      }
    }
  },
  initialGlobals: {
    theme: 'light'
  },
  decorators: [withTheme]
}

export default preview
```

```css
/* .storybook/preview.css */
body {
  background: var(--colorBackground);
}
```

- **The scheme goes on the root element, not on a wrapper around the story.** The background and the padding of the layout change with the theme, and portals, popovers and dialogs mounted outside the story root still get it.
- **The decorator sets the state, it does not flip it.** It applies the global on every render, so it needs no cleanup and holds across remounts and toolbar changes.
- **The toolbar lists the light theme first,** the first value of a `light-dark()` pair, and `initialGlobals.theme` starts with it.
- **`preview.css` paints the body with the background token,** and the body's background covers the whole frame. Skip it when the global stylesheet already paints the body.
- **`dynamicTitle: true`** shows the title of the current theme beside the `mirror` icon.
- **A story that is meaningful in one theme only pins it** with `globals: { theme: 'light' }`, on the story or on the meta.
- **The global is in the URL:** `iframe.html?id=<story-id>&globals=theme:light` opens a story in the light theme, which is how screenshots of both themes are taken (`chrome-mcp`).

The forced scheme reaches the tokens only while the CSS keeps `light-dark()` native (`ui-component`). Lightning CSS compiles it for Vite's default targets, the widely available baseline: in the CSS minifier of the build and, with `css.transformer: 'lightningcss'`, in dev too. So the config excludes the feature (the import needs `lightningcss` in the devDependencies):

```ts
// vite.config.ts
import { Features } from 'lightningcss'
import { defineConfig } from 'vite'

export default defineConfig({
  css: {
    lightningcss: {
      // Vite's default targets, the widely available baseline, would compile
      // light-dark() into variables switched by prefers-color-scheme, which a
      // color-scheme forced on the root cannot reach
      exclude: Features.LightDark
    }
  }
})
```

- **A compiled token shows in the frame:** `getComputedStyle(document.body).getPropertyValue('--colorBackground')` reads `var(--lightningcss-light, …)` instead of `light-dark(…)`. After changing the config, restart `pnpm storybook` and reload the preview without the cache.

### Tokens on a theme class

When the tokens live on a theme class, the exceptional case of `ui-component`, the decorator puts the class on the body and toggles the modifier instead. The toolbar lists the default theme of the design first, the one `.root` gives alone, and `initialGlobals.theme` names it.

```ts
// .storybook/preview.ts
import theme from '../app/uikit/Theme/Theme.module.css'

// The tokens go on the body, so the whole preview frame follows the theme toggle
const withTheme: Decorator = (story, context) => {
  document.body.classList.add(theme.root)
  document.body.classList.toggle(theme.light, context.globals.theme === 'light')

  return story()
}
```

`toggle(name, force)` sets the modifier from the global rather than flipping it, so this decorator holds across remounts too.

## Checking stories

- `pnpm storybook` serves on port 6006. Reuse a running instance instead of starting a second one.
- Before adding a component, browse the kit in Storybook for one that already plays the role.
- A change to a component is done when its stories render: open every story it touches (`chrome-mcp`) at the 1440, 375 and 320 widths and in both themes, and see `pnpm build:storybook` pass. A story that matters on a phone only pins the viewport with `globals: { viewport: { value: 'mobile1', isRotated: false } }`.
