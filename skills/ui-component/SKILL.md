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
- Build simple shapes with HTML+CSS instead of SVG (this scales up to e.g. a burger button animating into a cross).
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
- Use the form `submit` event to confirm and the `reset` event to clear/cancel. Listening to `submit` lets the form be confirmed both by button and by pressing Enter in an input; `<button type="reset">` clears the form.
- Manage focus where needed: autofocus the key control when a modal opens or a page loads; focus programmatically (`element.focus()`) e.g. an invalid input after submit; trap focus inside modal dialogs.
- Manage input text selection where needed, e.g. focus and select the text of an invalid input after submit.
- Give inputs appropriate `type`, `autocomplete` (optional), and `inputmode` (optional) attributes.
