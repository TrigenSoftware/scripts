---
name: ui-component
description: Framework-agnostic rules for writing UI components — semantic HTML, CSS Modules conventions (root class, camelCase, CSS Custom Properties), UX/accessibility requirements, and how components compose in any framework (a polymorphic `as`, shared bases, variants and parts, context, ids, a generic kit). Apply when creating, editing, or reviewing UI components, their markup, their props, or styles.
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

  - Never write global styles in CSS Modules — globals belong only in dedicated files. Two exceptions style the root element only while their component is on the page, so they stay in its module as `:global(html):has(...)`:
    - a modal's lock of the page's scroll while it is open, `:global(html):has(.root:modal)`, which belongs to the modal;
    - a page shell's or layout's ground on the root, such as the canvas behind a short page or the scrollbar's track, `:global(html):has(.root)`, which belongs to the frame.
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

- Use CSS Custom Properties as variables, named `(type)(Name)(Variant)?` where type is `duration`, `opacity`, `color`, `size`, `shadow`, `font`, `fontWeight`, `easing`, `zIndex` or `transition`. A component's own variable puts its name first, `--menuSizeMargin`. A count or a keyword, with no unit, names what it holds and takes no type, `--comboboxRows`, `--menuPositionArea`:

  ```css
  :root {
    --sizeText: 1rem;
    --sizeTextLg: 2rem;
    --colorBackground: #007bff;
    --colorBackgroundHover: #0069d9;
  }
  ```

- Implement responsiveness via CSS, not JS (`userAgent`/`matchMedia`/…) — it keeps server-side rendering simple.
- Every length is a token or a `calc` of tokens, with its reason named when it is a `calc`: a step less a border, an outer radius less an inset. A value no scale owns, such as an icon's intrinsic size, is a custom property scoped to the component (`--heroSizeBackPicture: 24px`), never a bare number in a rule.
- A border lies inside the design's numbers: a side with a border pads by its number less the border, `padding: calc(var(--sizeSpace4) - var(--sizeBorder))`, and a variant with no visible border keeps a transparent one, so its content stands where the bordered variant's does.
- A nested corner is concentric: the inner radius is the outer radius less the inset between them, `border-radius: calc(var(--sizeRadiusLg) - var(--sizeSpace2))`, never a token whose value happens to match. A base component whose radius a consumer must change reads a custom property with a fallback.
- Hover styles stand in `@media (hover: hover)`, so a tap on a touch screen does not leave a control looking hovered.
- A component that sets its own text takes the type scale's tokens together: size, line height and weight. A form control always does, as a normalize's element rule for `button`, `input` or `select` outranks a type class of no specificity. The shared type classes sit in `:where()`, so a component's own class refines them whichever stylesheet loads last.
- A component's own simple mark, such as a ring, a tick or a dot, is drawn in CSS from the element's state. Forced colors repaint backgrounds and drop shadows, so there the mark takes a border. A chevron or any other real icon stays an icon from the set.
- A row too narrow for its contents scrolls sideways at every width, with a shade at each end driven by the scroll (`animation-timeline: scroll(inline)`), rather than wrapping or folding into a More menu. Where scroll-driven animations are missing, as in Safari 18, it scrolls with no shade.
- The global stylesheet sets `-webkit-tap-highlight-color: transparent` on `html`, as each control's own `:active` shows the press, and `word-break: auto-phrase` on headings, so a Japanese word is not split in two where the browser can tell.

## UX & A11y

- Apply core accessibility practices.
- Inline components (links, labels, …) must not set a font size — they inherit it from the parent block.
- Interactive components (inputs, buttons, …) must:
  - have styles for `:hover`, `:active`, `:focus`, and `:disabled`, where `:focus` styles include the `:hover` styles;
  - have a visible outline on `:focus`;
  - have `cursor: pointer` by default and `cursor: default` when `:disabled`.
- The focus ring is one shared mixin that each component applies from its markup (the `css-mixin` skill), with a custom property as its one override point. Never an `outline-color` hardcoded in a component, and never a ring tinted by role or state. A control drawn over a photo, where no color clears 3:1, draws the ring inside itself, on its own focus fill.
- Controls in one row stand at one height, the control height token (the `design-system` skill's rhyme). A compact control sized for a pointer rises to that height under a finger, `@media (pointer: coarse)`, or keeps a 44 hit area around its look from the shared touch-target mixin, never a copy of it. What sits inside a control, an icon or an avatar, centres in its box and never sets the row's height.
- Make SVG icons accessible — a careless icon can break the accessibility of the element it's used in.
- Base custom components on native elements: clickable things on `<button>`; checkboxes and radios customized via `appearance: none` with `::before`/`::after`; selects via `appearance: none` (without pseudo-elements).
- A control component's root is the control itself — don't wrap an `<input>`/`<select>` in an extra element to host an adornment: the wrapper is unreachable from outside (class and props go to the control), it breaks layout containers whose children should be the controls, and a conditional wrapper remounts the control, losing focus and value. What stands beside a control, such as a unit or a status, belongs to the consumer's layout; what lies over it, an icon at its start or a clear button at its end, goes in a group component around the control, with `start` and `end` slots, which keeps the control's room for them. Composite components (a field group, a fieldset) may own a wrapper — their root is the group, not the control.
- Use the form `submit` event to confirm and the `reset` event to clear/cancel. Listening to `submit` lets the form be confirmed both by button and by pressing Enter in an input; `<button type="reset">` clears the form.
- Manage focus where needed: autofocus the key control when a modal opens or a page loads; focus programmatically (`element.focus()`) e.g. an invalid input after submit.
- A modal is the native `<dialog>` opened with `showModal()`: the browser makes the rest of the page inert, keeps focus inside, closes it on Escape and gives focus back to its opener. A focus-trap library is for a trap the platform does not give, never for a dialog.
- A button that goes away with the state it belongs to, such as Try again or Clear, sends focus to what stays, in its own click handler: the section's heading (`tabindex="-1"`) or the page's `main`. No state and no effect to restore focus afterwards.
- Manage input text selection where needed, e.g. focus and select the text of an invalid input after submit.
- Give inputs appropriate `type`, `autocomplete` (optional), and `inputmode` (optional) attributes.

## Composing components

These hold in any framework: a prop, a context, a part and an effect mean the same in each, and the framework skills (`react-component`, `nanoviews-component`) show the syntax.

### Roles and variants

- **A polymorphic `as` swaps elements of one role only,** such as a text that renders a `p` or a `span`. Once changing it also changes the look, the props that make sense or what may be nested inside, it is two components pretending to be one: the class prop and the spread no longer reach the element a consumer means, and one prop set for both roles lets invalid combinations through, such as actions inside a row that is itself a button. Share the layout through CSS instead.
- **The shared base of a known set of components is a component they render,** with `as` where their roots differ. Screens never render the base: each consumer pins its `as` and owns the props of its role, as a list row (`li`) and a button row (`button`, `a`) share a `Row`.
- **A variant reaches the parts through the stylesheet,** by a selector under the root's class, `.separated .item`, never through context or a prop that only puts a class on a part: a part looks the way it does because of where it stands. Context carries what a part needs in order to behave, such as a radio group's name, the chosen value, busy or the wiring of ids; never how the parent is drawn. Order the rules by specificity, the part's base, then the variant's selector, then the states, and a linter's descending-specificity rule passes with no extra class.
- **A prop that pulls in code is a second component.** A `loading` prop that renders a spinner pins the spinner into every chunk that imports the button; a loading button that composes the button is imported only where something waits (the `tree-shaking` skill). A prop that only adds a class or an attribute stays on the base: a variant, a color, a size and the state matrix cost nothing.
- **One component per case.** Never one component that switches on the route or on a config map to draw different things: each case is a component of its own, composing shared parts that are components too.
- **Derive what follows from the component's own props inside it,** such as an icon's stroke from its size, rather than making every consumer set it.

### Parts

- **A part never reports itself to its root.** A part that tells the root it is there from an effect, so the root can point an `aria-*` at it, say it is expanded or count it, leaves the server's HTML without that wiring, and costs the root a second render on every mount. Where the root's markup depends on whether a part is there, that part is the root's prop. The exception is a part only the client draws, after an interaction, such as a combobox's popover: the root starts closed.
- **Ids flow from the root.** The root takes an `id`, its parts derive theirs from it through the component's context (`${id}-title`), and the root sets `aria-labelledby` itself, with the part's own `id` left out of its props. Between separate components the wiring stays explicit at the call site.
- **A part marks itself, the parent reads the mark.** When a parent must react to an inner part, the part sets a `data-*` attribute it owns, after the spread and typed `never` in its props, and the parent's stylesheet reads it, `.root:has([data-more])`. Never a prop that hands the part a class.
- **A compound's own code stays in its folder:** its context and the helpers only its parts share live in a lowercase file beside them, left out of its index, and a part in a file of its own carries the component's prefix, `MenuLoadingItem` beside `MenuItem`. The layer's `shared/` is for code several components share.
- **Simplify by parts, never by stripping.** When one screen needs less of a shared component, the rest becomes optional parts each consumer composes. Never take a feature away from the component's other consumers.

### A generic kit

- **No prop that ties a kit component to a domain's meaning:** a list's group title takes no `dateTime`, and the consumer puts a `<time>` in its children. A component whose meaning is the domain itself, such as a timeline's month, may take one.
- **No app policy in the kit:** an attribute that every current use happens to need, such as a form's `method`, is set where the component is used, with the reason beside it. Ask whether the kit would still be right in another app before touching its root.
