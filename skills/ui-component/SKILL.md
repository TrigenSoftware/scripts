---
name: ui-component
description: Framework-agnostic rules for writing UI components — semantic HTML, CSS Modules conventions (root class, camelCase, CSS Custom Properties), and UX/accessibility requirements. Apply when creating, editing, or reviewing UI components, their markup, or styles.
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
    - ui
    - components
    - html
    - css
    - accessibility
---

# UI Component

## HTML

- Use semantic HTML elements wherever possible; e.g. display time with `<time datetime="...">`.
- Use `<button>` for buttons and `<a>` for links. If a button must look like a link (or vice versa), achieve that with styles — never swap the elements.
- Links that open external resources in a new tab must have `rel="noopener noreferrer"`.

## CSS

- Follow the BEM methodology — the principles, not the class naming. Key rule: a block must not affect its surroundings, i.e. no external geometry (margins, size-affecting borders) or positioning on the block itself.
- CSS Modules:
  - The root element's class must be named `.root`.
  - Use simple camelCase class names (easy to access from JS), not BEM naming:

    ```css
    .root { /* block */ }
    .element { /* element */ }
    .element.modificator { /* modifier */ }
    ```

  - Never write global styles in CSS Modules — globals belong only in dedicated files.
- Build a component's own simple marks with HTML+CSS instead of SVG: a ring, a dot, a tick, a burger that turns into a cross. Draw them with borders, `clip-path` or a pseudo-element in `currentColor`, at the icons' size and line weight. A glyph that many components show, such as a chevron, stays an icon of the set, and so does a picture with real detail, such as a tag or a leaf.
  - A mark that shows a state, such as a tick in a ring or a chevron turned open, is drawn from the state itself (`:checked`, `[aria-pressed='true']`, `[aria-expanded='true']`), never by swapping one icon for another: a swapped icon can flash empty while the browser resolves the new picture, and a drawn shape can animate between the states, as a burger turns into a cross.
  - Forced colors drop box shadows and repaint backgrounds, which erases a drawn shape, but keep borders in the system's ink, as they keep an icon's stroke, the highlight's text included where a control is drawn pressed. Draw the shape with a border there: a ring as a border, a filled shape as a top border as tall as the shape, with `background: none`.
- Use `currentColor` in icons and similar components (e.g. as SVG `fill`), so consumers set the color via the `color` property.
- Write computed values as the source expression, so it's clear where the number comes from:

  ```css
  .root {
    width: calc(100% / (320 / 16));
    /* or */
    width: 5%; /* 100% / (320 / 16) */
  }
  ```

- Use CSS Custom Properties as variables, named `(type)(Name)(Variant)?` where type is `duration`, `opacity`, `color`, `size`, or `shadow`:

  ```css
  :root {
    --sizeText: 1rem;
    --sizeTextLg: 2rem;
    --colorBackground: #007bff;
    --colorBackgroundHover: #0069d9;
  }
  ```

- Implement responsiveness via CSS, not JS (`userAgent`/`matchMedia`/…) — it keeps server-side rendering simple.

## UX & A11y

- Apply core accessibility practices.
- Inline components (links, labels, …) must not set a font size — they inherit it from the parent block.
- Interactive components (inputs, buttons, …) must:
  - have styles for `:hover`, `:active`, `:focus`, and `:disabled`, where `:focus` styles include the `:hover` styles;
  - have a visible outline on `:focus`;
  - have `cursor: pointer` by default and `cursor: default` when `:disabled`.
- Make SVG icons accessible — a careless icon can break the accessibility of the element it's used in.
- Base custom components on native elements: clickable things on `<button>`; checkboxes and radios customized via `appearance: none` with `::before`/`::after`; selects via `appearance: none` (without pseudo-elements).
- A control component's root is the control itself — don't wrap an `<input>`/`<select>` in an extra element to host an adornment: the wrapper is unreachable from outside (class and props go to the control), it breaks layout containers whose children should be the controls, and a conditional wrapper remounts the control, losing focus and value. Adornments belong to the consumer's layout. Composite components (a field group, a fieldset) may own a wrapper — their root is the group, not the control.
- Use the form `submit` event to confirm and the `reset` event to clear/cancel. Listening to `submit` lets the form be confirmed both by button and by pressing Enter in an input; `<button type="reset">` clears the form.
- Manage focus where needed: autofocus the key control when a modal opens or a page loads; focus programmatically (`element.focus()`) e.g. an invalid input after submit; trap focus inside modal dialogs.
- Manage input text selection where needed, e.g. focus and select the text of an invalid input after submit.
- Give inputs appropriate `type`, `autocomplete` (optional), and `inputmode` (optional) attributes.
