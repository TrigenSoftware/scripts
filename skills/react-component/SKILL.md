---
name: react-component
description: React-specific rules for writing components — component tiers (UI kit / business blocks / pages), folder structure, props conventions, and Storybook stories. Builds on top of the framework-agnostic ui-component skill. Apply when creating, editing, or reviewing React components.
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
    - react
    - components
    - ui
    - storybook
---

# React Component

Use the `ui-component` skill as the base — it holds the framework-agnostic HTML, CSS, and UX/a11y rules. This skill only adds React-specific rules on top.

## Component types

- **Simple UI components (UI kit).** Must not contain business logic, analytics collection, or hardcoded text (labels etc. are passed in from outside). Compound components expose their parts as subcomponents, not props:

  ```jsx
  // not
  <Select options={[...]} />
  // but
  <Select>
    <Option value="1">Option 1</Option>
    <Option value="2">Option 2</Option>
  </Select>
  ```

- **Business-logic blocks.** Compose simple UI components and stores into minimal blocks of business logic; may collect analytics, contain text, etc.
- **Pages.** Compose components of the two types above; may contain business logic, analytics, text, etc.

## Folder structure

```
[ComponentName]
  index.ts                    — re-export of the component and its types
  [ComponentName].tsx         — the component
  [ComponentName].module.css  — component styles
  [ComponentName].stories.tsx — stories (optional, if Storybook is used)
  [ComponentName].spec.tsx    — tests (optional, on request)
  hooks.ts                    — component logic extracted into hooks (optional, for complex components with a lot of logic); a `hooks/` folder when there are several
  loadable.tsx                — lazy-loaded wrapper (optional, when the component pulls in a heavy dependency)
  skeleton.tsx                — the component's skeleton, its shape while it or its data loads (optional)
```

A hook lives in a `.jsx` or `.tsx` file, in a `hooks.ts`, or in a file of a `hooks/` folder, wherever that file or folder stands: `uikit/hooks.ts`, `blocks/shared/hooks.ts`, `blocks/shared/hooks/garden.ts`. The linter's rules of hooks and React Compiler's rules find hooks by these files, so a hook in any other module goes unchecked.

## Reference component

```tsx
// Button.tsx
import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'
import styles from './Button.module.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export function Button({
  className,
  variant = 'primary',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(styles.root, styles[variant], className)}
      {...props}
    >
      {children}
    </button>
  )
}
```

```css
/* Button.module.css */
.root { /* ... */ }
.primary { /* ... */ }
.secondary { /* ... */ }
```

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'UIKit/Button',
  component: Button,
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary']
    },
    disabled: {
      control: 'boolean'
    }
  }
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    children: 'Button text'
  }
}

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Submit'
  }
}
```

## Loadable components

When a component pulls in a heavy dependency (a rich-text editor, a chart library, a syntax highlighter etc.), add a `loadable.tsx` next to it — a wrapper that loads the component lazily via `lazy` + `Suspense`, so the dependency stays out of the main bundle:

```tsx
// loadable.tsx
import {
  Suspense,
  lazy
} from 'react'
import type { MDXEditorProps } from './MDXEditor'
import { MDXEditorSkeleton } from './skeleton'

const LazyMDXEditor = lazy(() => import('./MDXEditor').then(({ MDXEditor }) => ({
  default: MDXEditor
})))

export function MDXEditor(props: MDXEditorProps) {
  return (
    <Suspense fallback={<MDXEditorSkeleton />}>
      <LazyMDXEditor {...props} />
    </Suspense>
  )
}
```

The wrapper keeps the original component name and props and adds none. It draws the component's own skeleton from the `skeleton.tsx` beside it, the shape of what is coming: no `fallback` prop, and never `fallback={null}`, which leaves a hole that fills in late.

## Skeletons

A component's shape while it or its data loads is its skeleton, named with the `Skeleton` suffix, never `Loading`: `MDXEditorSkeleton`, `FormSkeleton`. `Loading` names a state, as a `Loading` story or a `LoadingButton` does, not a shape. Every skeleton of a folder lives in the `skeleton.tsx` beside the component it draws: a compound's parts (`FormSkeleton`, `FormSectionSkeleton`, `FormGroupSkeleton`), a block's sections, a page's own skeleton and the parts only that page draws.

A skeleton draws no words: it is all in grey. A waiting state that keeps something real, such as its way back, a status's words or a label, is the component's own state and stays in the component's file, as no code-wait shape could draw those words; only an all-grey shape is a skeleton.

`skeleton.tsx` is an opt-in entry point, as `loadable.tsx` is: import it by its path, never re-export it from `index.ts`:

```tsx
// not
import {
  Form,
  FormSkeleton
} from '~/uikit/Form'

// but
import { Form } from '~/uikit/Form'
import { FormSkeleton } from '~/uikit/Form/skeleton'
```

A skeleton stands in while code loads, as a `loadable.tsx` fallback or as a route's shape while its page's chunk comes, so it lands in the main chunk. Through `index.ts` it would bring the component it stands in for into that chunk too, with everything the component imports.

A component that is a shape and nothing else, such as the frame every route's skeleton stands in, is an ordinary component named `<Name>Skeleton`, in a folder of its own with the usual files: `skeleton.tsx` is for the skeletons of another component.

## Component anatomy

Keep a fixed order of sections in the component function body:

1. **Declarations** — `const`/`let`: derived values, state, refs, memoized callbacks.
2. **Effects** — `useEffect`/`useLayoutEffect` and custom effect hooks (`useInterval`, `useClickOutside`, …).
3. **Conditional renders** — early `return`s for special states.
4. **Default render** — the final `return`.

```tsx
export function Discount({ value, expired }: DiscountProps) {
  const percent = value * 100
  const [show, setShow] = useState(true)
  const onCloseCallback = useCallback(() => {
    setShow(false)
  }, [])

  useEffect(() => {
    // ...
  }, [])

  if (!show || expired) {
    return null
  }

  return (
    <div className={styles.root}>
      Discount: {percent}%
      <button onClick={onCloseCallback}>Close</button>
    </div>
  )
}
```

The one exception: a value that reads what an early `return` narrowed, such as a record past `if (!report)`, is declared after that `return`, right before the render that uses it. Declared above, it would need a guard of its own for a state that never reads it. Everything else, hooks always, stands above the first `return`.

```tsx
export function ReportTitle({ className }: ReportTitleProps) {
  const report = useSignal($report)

  if (!report) {
    return <ReportTitleSkeleton className={className} />
  }

  // Reads the report the return above narrowed
  const heading = getReportHeading(report)

  return <h1 className={className}>{heading}</h1>
}
```

Name event handlers in the `on*` form, never `handle*`: `onCloseCallback`, `onClickCallback` for `useCallback`-wrapped handlers inside the component, `onSomeButtonClick` for handlers extracted to module scope — not `handleClose`/`handleClick`.

## With server rendering

The `ui-component` skill has the rules (Server rendering). In React:

- Ids come from `useId`, never a counter or `Math.random`. A value from outside React is read with `useSyncExternalStore` and its server snapshot. `suppressHydrationWarning` goes only where a head script sets attributes before hydration (the `css-light-dark` skill).

## With React Compiler

A project that builds with React Compiler memoizes nothing by hand: the compiler memoizes components and hooks as it builds them. There the rules above change:

- No `useMemo`, `useCallback` or `memo`. A handler or a derived value is written plainly, `const onCloseCallback = () => setShow(false)`, and stays the same between renders while what it reads does. Handlers keep their `on*Callback` names.
- A type a `useMemo<T>` gave a value stays on its variable: `const items: Item[] = …`.
- What the compiler cannot prove safe it leaves as written. Turn on its diagnostics, `compiler: { reportDiagnostics: true }` in `@vitejs/plugin-react` or a `logger` in the Babel plugin, to see which component stayed uncompiled and why. A component whose handler or value reaches an effect or a context must compile: move out what stops it.
- The compiler computes a value again only when what it reads changes. A value that changes on its own, such as the time read with `Date.now()`, comes from state or a store, so the render follows it.

## Rules

- Code that doesn't directly depend on the component must be moved out of the component body, to module scope:

  ```jsx
  // not
  function SomeButton() {
    const onClickCallback = useCallback(() => {
      location.href = 'some constant url'
    }, [])

    return <button onClick={onClickCallback}>Go</button>
  }

  // but
  function onSomeButtonClick() {
    location.href = 'some constant url'
  }

  function SomeButton() {
    return <button onClick={onSomeButtonClick}>Go</button>
  }
  ```

- Pass the `children` prop explicitly:

  ```jsx
  // not
  function Table(props) {
    return <table {...props}/>
  }

  // but
  function Table({ children, ...props }) {
    return <table {...props}>{children}</table>
  }
  ```

- Universal components must forward all remaining props to the root element, spreading `...props` after the explicitly set props — see the reference `Button` above: `onClick`, `type`, etc. reach `<button>` via the spread instead of being listed one by one. The exception is an attribute the component owns, one it derives from its own prop and must not lose to a passed-in value, such as `aria-disabled` rendered from a `busy` prop: it goes after the spread, and the props type declares it `never`. A hyphenated one, `aria-*` or `data-*`, needs that most: `Omit` cannot keep it out, as JSX does not check hyphenated names a props type lacks.
- `ref` is always the first prop and `className` the next — first among the JSX attributes and first in the props destructuring, as the reference `Button` does for `className`. A `ref` the component owns, which a passed one must not replace, stands after the spread with its other owned attributes, first among them:

  ```jsx
  // not
  <div id="card" className={styles.root} ref={rootRef}/>

  // but
  <div ref={rootRef} className={styles.root} id="card"/>
  ```

- `children` is always the last prop in the props destructuring, right before `...props` — `ref` and `className` open the list, `children` closes it, as the reference `Button` does:

  ```jsx
  // not
  function Card({
    className,
    children,
    title,
    ...props
  }) { /* ... */ }

  // but
  function Card({
    className,
    title,
    children,
    ...props
  }) { /* ... */ }
  ```

- In `clsx` the component's own classes come first and the passed-in `className` goes last, as the reference `Button` does:

  ```jsx
  // not
  clsx(className, styles.root, styles[variant])

  // but
  clsx(styles.root, styles[variant], className)
  ```

- `className` is a component's only class prop. Don't add props like `titleClassName` or `moreClassName` for its inner elements: split such an element out into a component of its own and compose the parts, each with its own `className`, the way compound components expose their parts as subcomponents:

  ```jsx
  // not
  <Card
    className={styles.card}
    titleClassName={styles.title}
    title="Title"
  >
    Text
  </Card>

  // but
  <Card className={styles.card}>
    <CardTitle className={styles.title}>Title</CardTitle>
    Text
  </Card>
  ```

  A `*ClassName` prop is for exceptional cases only, where the element cannot be split out. When a parent must react to an inner part, the part marks itself with a `data-*` attribute instead, as `ui-component` says.

- Don't pass unneeded props to the root element — destructure props consumed by hooks so they don't leak into the rest spread:

  ```jsx
  // not: useSuperHook's props end up on the <div>
  function SomeContainer(props) {
    const { children, ...otherProps } = props

    useSuperHook(props)

    return <div {...otherProps}>{children}</div>
  }

  // but
  function SomeContainer({
    superHookProp1,
    superHookProp2,
    superHookProp3,
    children,
    ...props
  }) {
    useSuperHook({
      superHookProp1,
      superHookProp2,
      superHookProp3,
    })

    return <div {...props}>{children}</div>
  }
  ```

- Import React top-level API by name:

  ```ts
  import { type ReactNode, memo, useState } from 'react'
  ```
