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
  use[HookName].ts            — component logic extracted into a hook (optional, for complex components with a lot of logic)
  loadable.tsx                — lazy-loaded wrapper (optional, when the component pulls in a heavy dependency)
```

## Reference component

```tsx
// Button.tsx
import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'
import styles from './Button.module.css'

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export function Button({
  className,
  variant = 'primary',
  children,
  ...props
}: IButtonProps) {
  return (
    <button
      className={clsx(className, styles.root, styles[variant])}
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
  type ReactNode,
  Suspense,
  lazy
} from 'react'
import type { IMDXEditorProps } from './MDXEditor'

export interface ILoadableMDXEditorProps extends IMDXEditorProps {
  fallback?: ReactNode
}

const LazyMDXEditor = lazy(() => import('./MDXEditor').then(({ MDXEditor }) => ({
  default: MDXEditor
})))

export function MDXEditor({
  fallback,
  ...props
}: ILoadableMDXEditorProps) {
  return (
    <Suspense fallback={fallback}>
      <LazyMDXEditor {...props} />
    </Suspense>
  )
}
```

The wrapper keeps the original component name and props, adding only an optional `fallback` prop for the `Suspense` fallback.

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

- Universal components must forward all remaining props to the root element, spreading `...props` after the explicitly set props — see the reference `Button` above: `onClick`, `type`, etc. reach `<button>` via the spread instead of being listed one by one.
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

- For focus locking use `react-focus-on` or `react-focus-lock`.
