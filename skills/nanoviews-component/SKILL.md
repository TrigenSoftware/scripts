---
name: nanoviews-component
description: Nanoviews-specific rules for writing components — component tiers (UI kit / business blocks / pages), folder structure, props and signal conventions, and Storybook stories. Builds on top of the framework-agnostic ui-component skill. Apply when creating, editing, or reviewing Nanoviews components.
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
    - nanoviews
    - kida
    - components
    - ui
    - storybook
---

# Nanoviews Component

Use the `ui-component` skill as the base — it holds the framework-agnostic HTML, CSS, and UX/a11y rules. This skill only adds Nanoviews-specific rules on top.

## Component types

- **Simple UI components (UI kit).** Must not contain business logic, analytics collection, or hardcoded text (labels etc. are passed in from outside). Compound components expose their parts as children, not props:

  ```js
  // not
  Select({ options: [...] })
  // but
  Select()(
    Option({ value: '1' })('Option 1'),
    Option({ value: '2' })('Option 2')
  )
  ```

  Children are collected with `children$`, named parts with `slot$`/`slots$`.

- **Business-logic blocks.** Compose simple UI components and stores into minimal blocks of business logic; may collect analytics, contain text, etc. A block `inject`s the stores it needs and passes their signals down.
- **Pages.** Compose components of the two types above; may contain business logic, analytics, text, etc.

## Folder structure

```
[ComponentName]
  index.ts                   — re-export of the component and its types
  [ComponentName].ts         — the component
  [ComponentName].module.css — component styles
  [ComponentName].stories.ts — stories (optional, if Storybook is used)
  [ComponentName].spec.ts    — tests (optional, on request)
  loadable.ts                — lazy-loaded wrapper (optional, when the component pulls in a heavy dependency)
```

There is no JSX, so every file is `.ts`, never `.tsx`.

## Reference component

```ts
// Button.ts
import type { Signalish } from 'nanoviews/store'
import {
  type ButtonHTMLAttributes,
  button,
  children$,
  classList$,
  props$
} from 'nanoviews'
import styles from './Button.module.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Signalish<'primary' | 'secondary'>
}

const $defaultVariant = () => 'primary' as const

export function Button(props: ButtonProps) {
  const {
    $class,
    $variant = $defaultVariant,
    ...restProps
  } = props$(props)

  return button({
    [classList$]: [
      $class,
      styles.root,
      () => styles[$variant()]
    ],
    ...restProps
  })
}
```

```css
/* Button.module.css */
.root { /* ... */ }
.primary { /* ... */ }
.secondary { /* ... */ }
```

```ts
// Button.stories.ts
import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import { Button } from './Button.js'

const meta: Meta<{
  variant: 'primary' | 'secondary'
  disabled: boolean
}> = {
  title: 'UIKit/Button',
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary']
    },
    disabled: {
      control: 'boolean'
    }
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render(props) {
    return Button(props)('Button text')
  }
}

export const Secondary: Story = {
  args: {
    variant: 'secondary'
  },
  render(props) {
    return Button(props)('Submit')
  }
}
```

Parameterize `Meta` with the plain args shape, not with the props interface, and give a story its own `render` whenever the component takes children.

## Loadable components

When a component pulls in a heavy dependency (a rich-text editor, a chart library, a syntax highlighter etc.), add a `loadable.ts` next to it — a wrapper that loads the component through a dynamic `import()` and swaps it in when it lands, so the dependency stays out of the main bundle:

```ts
// loadable.ts
import {
  type Child,
  swap_
} from 'nanoviews'
import { resolved } from 'nanoviews/store'
import type { MDXEditorProps } from './MDXEditor.js'

export interface LoadableMDXEditorProps extends MDXEditorProps {
  fallback?: Child
}

export function MDXEditor({
  fallback,
  ...props
}: LoadableMDXEditorProps) {
  const [$module] = resolved(() => import('./MDXEditor.js'))

  return swap_($module, module => (
    module
      ? module.MDXEditor(props)
      : fallback
  ))
}
```

The wrapper keeps the original component name and props, adding only an optional `fallback` prop for what stands in while the chunk loads.

## Component anatomy

Keep a fixed order of sections in the component function body:

1. **Props** — `props$` destructuring, `inject` of stores.
2. **Declarations** — `const`/`let`: derived values and signals.
3. **Effects** — `effect` and custom effect helpers.
4. **Return** — the view, a single expression.

```ts
import {
  type Signalish,
  computed,
  signal
} from 'nanoviews/store'
import {
  button,
  div,
  effect,
  if_,
  props$
} from 'nanoviews'
import styles from './Discount.module.css'

const PERCENT = 100

export interface DiscountProps {
  value: Signalish<number>
  expired: Signalish<boolean>
}

export function Discount(props: DiscountProps) {
  const {
    $value,
    $expired
  } = props$(props)
  const $percent = computed(() => $value() * PERCENT)
  const $show = signal(true)
  const $visible = computed(() => $show() && !$expired())

  effect(() => {
    // ...
  })

  return if_($visible)(
    () => div({ class: styles.root })(
      'Discount: ', $percent, '%',
      button({
        onClick() {
          $show(false)
        }
      })(
        'Close'
      )
    )
  )
}
```

There is no conditional-render step: a special state is a flow primitive inside the returned view, never an early `return`.

Write event handlers inline in the element, as above — there is nothing to memoize, so a handler in the attributes object reads better than a `const` above the view. There is no `useCallback` and no `*Callback` suffix. A handler that moves out to module scope takes an `on*` name: `onSomeButtonClick`, never `handleClick`.

## View formatting

Lay the view out like JSX markup: once an element's head spans several lines, its children go on their own lines too, and the returned view is wrapped in parentheses so the whole tree is indented as one block.

```js
// not
return button({
  onClick: onSomeButtonClick
})('Go')

// but
return (
  button({
    onClick: onSomeButtonClick
  })(
    'Go'
  )
)
```

An element without children is a single call — leave it unwrapped:

```js
return button({
  onClick: onSomeButtonClick
})
```

A view that already opens as a tree — a head that fits on one line, children below it — needs no extra wrapper:

```js
return if_($visible)(
  () => div({ class: styles.root })(
    'Discount: ', $percent, '%',
    button({
      onClick() {
        $show(false)
      }
    })(
      'Close'
    )
  )
)
```

Adding parentheses and line breaks there is still allowed wherever it reads better.

If the project's linter rejects this layout, or its `--fix` collapses it back, tell the user which rule fights the format instead of silently accepting the reformatted code — they may prefer to adjust the rule rather than the code.

## Rules

- Prefix a name with `$` only when it always holds a signal or an accessor: a signal declared in the body, an accessor read through `props$`, a prop typed `Accessor<T>` or `WritableSignal<T>`. A `Signalish<T>` prop may arrive as a plain value, so it keeps the plain name — `variant` in the props, `$variant` only after `props$`.
- Type a prop that may arrive as either a value or a signal as `Signalish<T>` and read it through `props$`; type a prop the component writes to as `WritableSignal<T>` and name it `$name`:

  ```ts
  export interface AutocompleteProps {
    id: string
    label: string
    $value: WritableSignal<string>
    $suggestions: Accessor<City[]>
  }
  ```

- Code that doesn't directly depend on the component must be moved out of the component body, to module scope:

  ```js
  // not
  function SomeButton() {
    return (
      button({
        onClick() {
          location.href = 'some constant url'
        }
      })(
        'Go'
      )
    )
  }

  // but
  function onSomeButtonClick() {
    location.href = 'some constant url'
  }

  function SomeButton() {
    return (
      button({
        onClick: onSomeButtonClick
      })(
        'Go'
      )
    )
  }
  ```

- Universal components must forward all remaining props to the root element, spreading `...restProps` before the attributes the component owns — see the reference `Button` above: `type`, `disabled`, `onClick` etc. reach `<button>` via the spread instead of being listed one by one.
- Don't pass unneeded props to the root element — read the props consumed by a helper as `$name`, which is what takes them out of the rest:

  ```js
  // not: bindSuperBehavior's props end up on the <div>
  function SomeContainer(props) {
    const { ...restProps } = props$(props)

    bindSuperBehavior(props)

    return div(restProps)
  }

  // but
  function SomeContainer(props) {
    const {
      $superProp1,
      $superProp2,
      $superProp3,
      ...restProps
    } = props$(props)

    bindSuperBehavior({
      $superProp1,
      $superProp2,
      $superProp3
    })

    return div(restProps)
  }
  ```

- A component that owns classes and also accepts a `class` prop reads `$class` and folds it into the `classList$` list, as the reference `Button` does.
- Import views from `nanoviews` and reactivity from `nanoviews/store`, by name:

  ```ts
  import {
    type Signalish,
    computed,
    signal
  } from 'nanoviews/store'
  import {
    button,
    div,
    effect,
    if_
  } from 'nanoviews'
  ```

- `react-focus-on` and `react-focus-lock` are React-only. Drive a DOM-level focus trap (e.g. `focus-trap`) from an `effect`, and tear it down in the effect's cleanup.
