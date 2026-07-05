---
name: css-mixin
description: Pattern for mixins in native CSS (no preprocessor) — a mixin is a class in a shared CSS Module, its parameters are CSS Custom Properties, applied by adding the class to an element. Apply when creating or using reusable style mixins in a CSS Modules codebase.
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
    - css
    - css-modules
    - mixins
    - ui
---

# CSS Mixin

In native CSS a mixin is a class:

- the mixin's parameters are CSS Custom Properties, with defaults declared on the class itself;
- to use a mixin, add its class to the element and override the CSS variables as needed.

## Example

Mixins live in a shared file, e.g. `mixins.module.css`. A `focusOutline` mixin:

```css
.focusOutline {
  --transitionFocusOutline: outline var(--durationSm) ease;
  --colorFocusOutline: var(--colorBrandLight);
  transition: var(--transitionFocusOutline);
  outline: var(--sizeBorderFocus) solid transparent;

  &:is(input, textarea):focus {
    outline-color: var(--colorFocusOutline);
  }

  &:not(:is(input, textarea)):focus-visible {
    outline-color: var(--colorFocusOutline);
  }
}

@media screen and (prefers-reduced-motion: reduce) {
  .focusOutline {
    transition: none;
  }
}
```

Usage:

```tsx
import clsx from 'clsx'
import mixins from '~/uikit/mixins.module.css'
import styles from './Button.module.css'

export function Button({
  className,
  variant = 'primary',
  children,
  ...props
}) {
  return (
    <button
      className={clsx(className, styles.root, styles[variant], mixins.focusOutline)}
      {...props}
    >
      {children}
    </button>
  )
}
```
