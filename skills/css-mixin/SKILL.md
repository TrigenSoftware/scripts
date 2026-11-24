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
      className={clsx(styles.root, styles[variant], mixins.focusOutline, className)}
      {...props}
    >
      {children}
    </button>
  )
}
```

A second mixin, a target a finger can press: at least 44 each way and centred on the element, while its look stays as drawn. Under a finger the element's `::after` reaches past its box and takes its presses. Its `position: relative` sits in `:where()`, at no specificity, so an element positioned for its own reasons keeps that, and a parameter lifts the target off the centre where the one below would meet it:

```css
@media (pointer: coarse) {
  :where(.touchTarget) {
    position: relative;
  }

  .touchTarget::after {
    position: absolute;
    inset: 50% auto auto 50%;
    border-radius: inherit;
    block-size: max(100%, var(--sizeControlMd));
    inline-size: max(100%, var(--sizeControlMd));
    content: '';
    translate: -50% calc(-50% - var(--sizeTouchTargetLift, 0px));
  }
}
```

## Rules

- Apply a mixin by its class, from the component's markup, as above. Never through `composes`: it brings the mixin's whole module into the composing sheet, and the later copy in the build overrides everything of equal specificity loaded before it.
- The override point of a mixin is its custom property. A consumer sets the variable, `--colorFocusOutline` for the ring's color, rather than overriding the properties the mixin sets.
- A mixin is one class for one concern any element may take: the focus ring, a touch target, a picture hidden in one theme. Once the shared part needs states or variants of its own, or a class the consumer must also put on an inner element, it is a base component: consumers render it and add only their layout. A selector such as `:has(.input:checked)` against a hashed class from another module silently matches nothing, which is the first sign.
- The shared base of a known set of components is a component they render, even when it is one class with no states, as the `ui-component` skill says: a mixin is for what any element may take, not for the shared code of specific components. Importing another component's CSS module to take its classes is fine.
