---
name: css-light-dark
description: Light and dark theme in native CSS — color tokens as `light-dark()` pairs on `:root` with `color-scheme`, so the site follows the system; a forced `color-scheme` for a theme switch or a preview toolbar; keeping `light-dark()` native through the build; and a theme class with a palette of its own for widgets on someone else's page. Apply when defining color tokens, adding a dark theme, or wiring a theme switch.
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

- A site's own theme switch forces the scheme on the root the same way, so the tokens stay `light-dark()` pairs.
- A theme class with a palette of its own is for exceptional cases, such as DevTools that sit on someone else's page and switch their own theme: the root is not theirs to set. Their tokens live on the class: the default palette on `.root`, the other one on a modifier that redefines the colors. Each sets its `color-scheme`, so native controls and scrollbars follow:

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
