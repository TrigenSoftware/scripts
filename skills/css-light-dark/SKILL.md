---
name: css-light-dark
description: Light and dark theme in native CSS — color tokens as `light-dark()` pairs on `:root` with `color-scheme`, so the site follows the system; keeping `light-dark()` native through the build; a theme switch that forces `color-scheme` on the root, keeps the choice in `localStorage` and sets it from an inline script in the head, so a server-rendered page opens in the chosen theme; pictures drawn for one theme; and a theme class with a palette of its own for widgets on someone else's page. Apply when defining color tokens, adding a dark theme, or wiring a theme switch.
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
    - theme
    - dark-mode
    - color-scheme
    - ui
---

# CSS Light and Dark

- Make the tokens `light-dark(<light>, <dark>)` pairs on `:root` with `color-scheme: light dark`, so the site follows the system. A `color-scheme` set on the root element forces one scheme, which is how the Storybook toolbar switches it:

  ```css
  /* uikit/variables.css */
  :root {
    --colorBackground: light-dark(#f2f2f4, #1d1d1f);
    --colorText: light-dark(#1d1d1f, #ececee);
    /* light-dark() takes colors alone: a shadow gets one for each of its colors */
    --shadowCard: 0 1px 2px light-dark(rgb(0 0 0 / 12%), rgb(0 0 0 / 40%));
    /* ... */

    color-scheme: light dark;
  }
  ```

- Don't put tokens behind `@media (prefers-color-scheme: dark)`: they follow the system and nothing else, and no forced scheme reaches them.
- Keep `light-dark()` native in the built CSS: lightningcss compiles it for older targets into variables switched by `prefers-color-scheme`, which a forced `color-scheme` can't reach. Exclude the feature from its transforms:

  ```js
  // vite.config.js
  import { Features } from 'lightningcss'

  export default {
    css: {
      transformer: 'lightningcss',
      lightningcss: {
        exclude: Features.LightDark
      }
    }
  }
  ```

## Roles in two themes

- The dark theme's neutral roles draw from a ramp of hue-less greys of their own, never from the light theme's tinted ramp: a tint that reads neutral beside white reads colored on a dark ground (the `design-system` skill's color rules).
- Where the dark theme needs another step than the light one, the role says so, its pair taking different steps of the ramps. Never read another role because its light value happens to match: the two part in the dark.
- A state that lifts reads the roles made for it, such as a hover's or a raised surface's, never the canvas or the surface because their light values match what it needs: in the dark theme the canvas and the surface sink below what stands on them.

  ```css
  :root {
    --colorBgSurface: light-dark(var(--colorWhite), var(--colorGray900));
    /* Not --colorBgCanvas, which matches it in the light theme and sinks in the dark */
    --colorBgSurfaceHover: light-dark(var(--colorNeutral50), var(--colorGray800));
  }
  ```

- What stands on a photo keeps the light theme by `color-scheme: light` on itself: a glass bar, a white disc behind an icon, a chip over a hero picture, a photo viewer. Its tokens then resolve to their light half whatever the page's theme, and nothing on it inverts.

## A theme switch

A site's own theme switch forces the scheme on the root the same way, so the tokens stay `light-dark()` pairs. The choice is the browser's, kept in `localStorage`, never in a cookie or the account: the server renders one page for everyone, and a visitor without an account can choose too. The page's head sets it before the stylesheets arrive, so a server-rendered page opens in the chosen theme, never in the system's first:

```html
<head>
  <!-- The browser paints its canvas and controls in the system's theme before the stylesheets come -->
  <meta name="color-scheme" content="light dark">
  <!-- The theme chosen; a browser that refuses storage throws, and keeps the system's -->
  <script>
    try {
      const theme = localStorage.getItem('theme')

      if (theme === 'light' || theme === 'dark') {
        document.documentElement.dataset.theme = theme
        document.documentElement.style.colorScheme = theme
      }
    } catch {}
  </script>
  <link rel="stylesheet" href="/styles.css">
</head>
```

The switch keeps the choice and sets it the same way. System sets nothing, and the root's `color-scheme: light dark` follows the device again:

```ts
// theme.ts
export type Theme = 'system' | 'light' | 'dark'

// The key the head's script reads too
const THEME_KEY = 'theme'

/**
 * Sets a theme on the root: `color-scheme` picks each token's half, and `data-theme` serves what
 * a token can't switch, such as a picture drawn for one theme.
 * @param theme - The theme; anything but `light` and `dark` is the system's.
 */
export function applyTheme(theme: string | null) {
  const root = document.documentElement

  if (theme === 'light' || theme === 'dark') {
    root.dataset.theme = theme
    root.style.colorScheme = theme
  } else {
    root.removeAttribute('data-theme')
    root.style.removeProperty('color-scheme')
  }
}

/**
 * Keeps the theme chosen and sets it.
 * @param theme - The theme chosen.
 */
export function setTheme(theme: Theme) {
  try {
    if (theme === 'system') {
      localStorage.removeItem(THEME_KEY)
    } else {
      localStorage.setItem(THEME_KEY, theme)
    }
  } catch {
    // A browser that refuses storage keeps the choice for this page alone
  }

  applyTheme(theme)
}

/**
 * Follows a theme chosen in another tab.
 * @returns Stops following.
 */
export function syncTheme() {
  function onStorage(event: StorageEvent) {
    if (event.key === THEME_KEY) {
      applyTheme(event.newValue)
    }
  }

  window.addEventListener('storage', onStorage)

  return () => window.removeEventListener('storage', onStorage)
}
```

A picture drawn in one theme's inks, such as a logo, has no token to switch: it comes twice, and the theme hides one of the two. With no theme chosen, the system's decides:

```css
/* mixins.module.css */

/**
 * `hideDark` on a picture drawn for the light theme, `hideLight` on its twin for the dark one.
 */

:root[data-theme='dark'] .hideDark,
:root[data-theme='light'] .hideLight {
  display: none;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) .hideDark {
    display: none;
  }
}

@media (prefers-color-scheme: light) {
  :root:not([data-theme]) .hideLight {
    display: none;
  }
}
```

- Nothing the server renders shows the choice: the server doesn't know it, and the browser's first render would differ from the HTML. A control that shows it, such as a menu's checked item, reads it in the browser, once the menu opens.
- A framework that hydrates `<html>` finds two attributes there it didn't render: let it keep them, as React's `suppressHydrationWarning` on `<html>` does.
- A color reads its token, never `data-theme`. The attribute is for what a token can't switch, a picture: a `<source media>` reads the system's theme alone, and an SVG picture's own `prefers-color-scheme` doesn't follow the page in Safari 18, which draws its light inks whatever the theme.

## A theme class

A theme class with a palette of its own is for exceptional cases, such as DevTools that sit on someone else's page and switch their own theme: the root is not theirs to set. Their tokens live on the class: the default palette on `.root`, the other one on a modifier that redefines the colors. Each sets its `color-scheme`, so native controls and scrollbars follow:

```css
/* uikit/Theme/Theme.module.css */
.root {
  --colorBackground: #1d1d1f;
  --colorText: #ececee;
  /* ... */

  color-scheme: dark;
  color: var(--colorText);
}

.light {
  --colorBackground: #f2f2f4;
  --colorText: #1d1d1f;
  /* ... */

  color-scheme: light;
}
```
