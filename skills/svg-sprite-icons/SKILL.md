---
name: svg-sprite-icons
description: Pattern for SVG icons via a symbol sprite — individual SVG files are compiled into a single sprite.svg by the svg-sprite package, and an Icon component renders them with <use href="sprite.svg#name">. Apply when setting up an icon system, adding icons to a project that uses this pattern, or reviewing icon-related code.
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
    - svg
    - icons
    - sprite
    - ui
    - react
---

# SVG Sprite Icons

Icons are stored as individual SVG files, compiled into a single symbol sprite by a script, and rendered through an `Icon` component that references sprite symbols with `<use>`. The browser downloads one sprite file instead of inlining every icon into the JS bundle.

## Structure

```
app/assets/icons/*.svg   — source icons, one file per icon; the file name becomes the symbol id
app/assets/sprite.svg    — generated sprite, committed to the repo
scripts/svg-sprite.js    — generation script
app/uikit/Icon/          — Icon component (see the react-component skill for folder conventions)
```

## Source icons

- One SVG file per icon; the file base name (`copy.svg` → `copy`) becomes the `<symbol>` id and the `Icon` component's `name` value.
- Monochrome icons must use `currentColor` for `stroke`/`fill`, so consumers set the color via the CSS `color` property (see the ui-component skill).
- Multicolor icons (status badges, logos) keep their hardcoded colors.
- Keep the original `viewBox`; the sprite preserves it per symbol, and the rendered size is set on the `Icon` element.

## Generation script

`scripts/svg-sprite.js` uses the `svg-sprite` package in `symbol` mode and writes all icons into one sprite file:

```js
import {
  resolve,
  join,
  basename
} from 'node:path'
import {
  readFile,
  writeFile,
  glob
} from 'node:fs/promises'
import SVGSpriter from 'svg-sprite'

const rootDir = resolve(import.meta.dirname, '..')
const spriter = new SVGSpriter({
  mode: {
    symbol: true
  }
})
const iconFiles = glob(join(rootDir, 'app', 'assets', 'icons', '*.svg'))
const tasks = []

for await (const filePath of iconFiles) {
  const fileName = basename(filePath)

  tasks.push(readFile(filePath, 'utf-8').then((content) => {
    spriter.add(fileName, fileName, content)
  }))
}

await Promise.all(tasks)

const { result } = await spriter.compileAsync()

await writeFile(join(rootDir, 'app', 'assets', 'sprite.svg'), result.symbol.sprite.contents)
```

Wire it up in `package.json`:

```json
"build:sprite": "node ./scripts/svg-sprite.js"
```

with `svg-sprite` (and `@types/svg-sprite` in TypeScript repos) as dev dependencies.

The generated `sprite.svg` is committed. The `build` script does not regenerate it — run `pnpm build:sprite` manually whenever source icons change and commit the result.

## Icon component

A simple UI kit component (see the react-component skill). The available icon names live in an exported `IconName` union type — it doubles as autocomplete and a compile-time check that the icon exists, and consumers can use it to type their own props:

```tsx
// Icon.tsx
import type { SVGAttributes } from 'react'
import spriteUrl from '~/assets/sprite.svg?no-inline'

export type IconName = 'copy' | 'flower' | 'home' | 'plus' | 'retry' | 'trash' | 'check'

export interface IconProps extends SVGAttributes<SVGSVGElement> {
  name: IconName
  width?: number
  height?: number
}

export function Icon({
  name,
  width,
  height,
  ...props
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      aria-hidden='true'
      {...props}
    >
      <use xlinkHref={`${spriteUrl}#${name}`}/>
    </svg>
  )
}
```

Key points:

- Import the sprite as a URL. The Vite `?no-inline` query is required: Vite inlines small assets as data URIs by default, and `<use>` fragment references (`#name`) do not work with data URIs. In non-Vite bundlers use the equivalent "emit as file, give me the URL" import.
- `aria-hidden='true'` goes before the `...props` spread — icons are decorative by default, and consumers can override it for meaningful icons (paired with `role='img'` and a label on the element).
- `width`/`height` set the rendered size; the symbol's own `viewBox` handles proportions.
- Usage: `<Icon name='copy'/>`; color is inherited via CSS `color` thanks to `currentColor` in the source icons.

## Adding a new icon

1. Put the SVG file into `app/assets/icons/`, named after the icon (`arrow-left.svg`). Replace hardcoded colors with `currentColor` if the icon is monochrome.
2. Run `pnpm build:sprite` and commit the regenerated `sprite.svg` together with the source icon.
3. Add the name to the `IconName` union and to the `options` list in `Icon.stories.tsx`.
4. Use it: `<Icon name='arrow-left'/>`.

## Gotchas

- The `IconName` union and the Storybook `options` list are maintained by hand — when icons are added or removed, keep them in sync with the files in the icons directory.
- If an icon renders black instead of the surrounding text color, its source file has a hardcoded `fill`/`stroke` instead of `currentColor` — fix the source and regenerate the sprite.
- If icons disappear in production but work in dev, check that the sprite is emitted as a real file (`?no-inline`, `assetsInlineLimit`) — a data-URI sprite silently breaks all `<use>` references.
- `svg-sprite` in `symbol` mode may rewrite internal ids (clip paths, gradients) to avoid collisions between icons — never reference internal ids of a sprite from outside; only the symbol ids are public.
