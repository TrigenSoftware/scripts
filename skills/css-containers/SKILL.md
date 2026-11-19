---
name: css-containers
description: Pattern for named CSS container queries in a CSS Modules codebase — every container name is a class in one shared CSS Module, the only place that declares `container:`, put on the element that is the container; parts query the name with `@container`. Covers why the names are global tokens, how they follow the layers' dependency direction, and when a container stays unnamed. Apply when adding a container query, a container, or a part that follows its parent's width.
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
    - container-queries
    - ui
---

# CSS Containers

A named container query is a dependency between stylesheets: one element is the container, and the parts inside it query its width. In a CSS Modules codebase the names are tokens, as colors and sizes are:

- every container name is a class in one shared CSS Module, e.g. `containers.module.css`, and that file is the only place that declares `container:`;
- to make an element a container, add its class to the element;
- a part that follows the width queries the name with `@container`.

## Example

The container names, each with what carries it and what reads it:

```css
/* containers.module.css */

/**
 * A grid of tiles, `Grid variant='tiles'`. Read by Grid and by the tiles,
 * which close up at 420 or less.
 */

.tiles {
  container: tiles / inline-size;
}

/**
 * A page's row of a search, its filters and its actions. Read by the filter's
 * trigger, which chooses its words by the room its row leaves.
 */

.toolbar {
  container: toolbar / inline-size;
}
```

The component that is the container puts the class on itself:

```tsx
import clsx from 'clsx'
import containers from '~/uikit/containers.module.css'
import styles from './Grid.module.css'

export function Grid({
  className,
  variant = 'fields',
  children,
  ...props
}) {
  return (
    <div
      className={clsx(styles.root, styles[variant], variant === 'tiles' && containers.tiles, className)}
      {...props}
    >
      {children}
    </div>
  )
}
```

A part queries the name in its own stylesheet:

```css
/* ChoiceCard.module.css */
@container tiles (max-width: 420px) {
  .tile .text {
    font-size: var(--sizeFont12);
  }
}
```

A row that a business block lays out takes a container of the kit's the same way:

```tsx
<div className={clsx(styles.root, containers.toolbar, className)}>
  {/* the search, the filter, the actions */}
</div>
```

## Rules

- **The names are global.** A query reads a name declared in another file, and CSS Modules has no way to import one: Lightning CSS supports neither `@value` nor ICSS `:import`/`:export`, its `from` references cover classes (`composes`) and dashed idents (`var(--x from './file.css')`) alone, and a query's prelude takes no `var()`. Turn off the hashing of container names where the implementation does it, e.g. Lightning CSS's `cssModules: { container: false }`, which Vite takes as `css.lightningcss.cssModules`. Hashed, a name declared in one module and queried in another silently matches nothing.
- **A name is a token, named by its role:** `tiles`, `toolbar`, `search-band`, `card-body`. Never after one component (`media-card`) and never after a block or a page. The name is kebab-case, as stylelint's `value-keyword-case` keeps a keyword lower-case, and its class is the camelCase form CSS Modules want: `.cardBody` makes `card-body`.
- **The shared file is the registry.** Each class says what the container is, what carries it and what reads it. A new name goes there first; nothing writes `container:` anywhere else.
- **Dependencies follow the layers** (see the `flat-layers-design` skill). The names belong to the UI kit, as its design tokens do. A kit component queries the kit's names alone. A business block may put a kit's container class on a row it lays out and may query a kit's name for its own layout, but never names a container that a kit component reads: the kit would then depend on the block.
- **One container class per element.** `container` is one property, so a second class on the same element overrides the first. An element that must be two containers gets one class in the shared file that names both: `container: toolbar search-band / inline-size`.
- **An unnamed container stays local.** An element that measures itself for its own parts alone takes `container-type: inline-size` in its own stylesheet, with no name. An unnamed `@container (…)` query and the `cqi`/`cqw` units read the nearest container, whatever its name, so they serve that element's own parts alone; whatever another module queries gets a name, and so a class in the shared file.
- **Containment has a cost.** `inline-size` containment makes the element's inline size independent of its content: a container is an element whose width comes from its parent, a grid track or a block-level row, never one that should shrink to its content.
