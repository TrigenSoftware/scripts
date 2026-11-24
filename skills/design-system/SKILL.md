---
name: design-system
description: How to build and keep a design system as a source of its own, apart from the app's code — the book (principles, content rules, visual foundations), tokens by role, a page per component, patterns, accessibility, a decision log, and screens drawn per state on canonical data — and the rules that keep it small and coherent: minimal variety on every axis, one role one component, established names, balanced spacing and geometry, contrast, research before a new design, and a check of every change. Apply when creating or changing a design system, its tokens, components, patterns or screens, when designing a new feature on it, or when building the app finds a rule the design should change, even if the request only says "design" or "mockup".
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
    - design-system
    - design-tokens
    - ui
    - accessibility
---

# Design System

A design system is the product's design kept as a source of its own: the rules, the tokens, the components and the screens, in a repository the app's code follows. It is reviewed and decided, and the code implements it. This skill is about that source. How a component is built in code belongs to the `ui-component` skill and the framework skills.

## What it holds

- **The book:**
  - the principles;
  - the content rules: the voice, one word per thing, the copy rules, dates, times and numbers, and the data the product has, and nothing else;
  - the visual foundations: color, the dark theme, type, space, size and shape, layout, imagery, motion;
  - the iconography;
  - how to use the system: how to load it, the class and markup conventions, which states the stylesheet draws from the element's native state.
- **The tokens:** one file, each role with a note on what it is for, compiled into what the stylesheet and the screens read.
- **A page per component:**
  - its tier: a kit component has no data of its own, a block is bound to the product's objects;
  - When to use, and When not to use, with the component to take instead;
  - Anatomy, Variants and states, Content, Accessibility, Responsive;
  - Replaces: what in today's app it replaces;
  - Markup: the contract the code implements, kept equal to one canonical snippet.
- **Patterns:** what crosses components, such as navigation by width, waiting forms, loading, failure, empty states, destroying, menus, sheets and dialogs, optimistic changes, and what stays in view.
- **Accessibility:** targets, focus, contrast in every theme, forced colors, reduced motion, semantics, ARIA patterns, announcements, and what was measured and how.
- **The decision log:** see [The decision log](#the-decision-log).
- **Screens:** a spec per state, composed from the components on canonical sample data.

## The source of truth

- The code follows the system. When building the app finds a better rule, change the system first: its source, the log and the screens it touches. Then the code follows.
- Change the source and rebuild. Never edit a published or exported copy alone: the next build overwrites it.
- The scope is what the product does and its platform serves. A screen never shows data the product does not have, and what is left out on purpose is listed.

## Minimal variety

Every axis has the smallest set of steps that does the job: color, spacing, radius, elevation, type, breakpoints, components. Established practice needs no defence, and a ten-step neutral ramp is not accidental variety. What is rejected is variety nobody tracked.

### Color

- Tokens are roles by meaning: backgrounds, text, borders, overlays, focus, statuses. Roles draw from the palette's ramps.
- Add a role only for a meaning the existing roles cannot express, or for a measured contrast failure, and say which role was tried and why it fails. Symmetry is not a reason: a danger set with a border tint and a ring tint does not entitle success to both.
- Two roles may share a value and stay two roles. Never pick a role because its value happens to match: a badge's fill, a brand tint and a picture's empty frame can be three near-identical greens with three jobs.
- A palette named after a component, such as an avatar's fills or a chart's series, belongs to that component. It becomes a role of the system when the system needs it as one, never because a second component reads it.
- Every role is a light and a dark pair:
  - the dark theme's neutrals are hue-less greys: a tint that reads neutral beside white reads colored on a dark ground;
  - the brand's color stands only where it means something, such as an action, the current place or a choice;
  - a lifted state, such as hover or raised, has roles of its own, since in the dark theme the canvas and the surface sink below what stands on them.
- The focus ring is one color that clears 3:1 on every surface it is drawn on. It is never tinted by role or state: on an invalid field the error keeps its red edge and the ring stays the ring, two signals.

### Scales

- Snap to the scale: take the nearest step, and the smaller one on a tie. Size, line height and weight move together.
- Add a step only when the gap is real and recurring: a component needs a scale for its API, as a size option needs control heights, or a layout breaks at a width. The new step lives where its siblings live and follows their pattern.
- Geometry no scale can own, such as an icon's intrinsic size or an optical correction you can name, is a value scoped to its component. It is never a way around snapping: spacing, type size, line height and radius always snap.
- Reuse a token by its purpose, not its number: a spacing token does not become a control's size because the values match.

### Type

- Every text is a variant at a size. The variant says what the text is (title, body, label, caption), the size is a step of its scale. A size never goes into a variant's name, such as `bodySm` or `title1`, or every combination becomes a variant of its own.
- A mockup's 13px between the scale's 12 and 14 is a coincidence, not a decision.

### Breakpoints

- Few, and shared by every component. A layout that switches at 380 says that small phones break, not that the system needs 380: map it to the nearest breakpoint, fix the layout first, and add a breakpoint only if a real constraint remains.

## Components

- **One role, one component.** Judge by the task, the interaction, the content and what each state means, never by looks alone. Compare what each is in markup: a row that is a list item and a row that is a button share a layout and nothing else. They are two components with one look.
- **Extend before you add.** A new variant, state or slot comes first. A variant may change the look a lot and stay the same component, as long as the role and the states are the same. Split when extending would grow the complexity a lot: options that exclude each other, a state matrix nobody can hold, a purpose you cannot say without "or". Two simple components are a good outcome.
- **Average the look-alikes.** Three elements that play one role become one component, even when it matches none of them exactly.
- **No variety a screen does not use.** A variant exists because a screen draws it.
- **Every state is drawn:** rest, hover, pressed, focus, disabled, selected, loading, invalid, the error and its recovery, empty. A mockup draws one of them; the system draws the rest.
- **Keep the distinctions that carry meaning,** such as single against multiple choice, or navigation against progress, even when the two look alike.

## Names

- Prefer the established term. Check a candidate against the mainstream kits (Material, Ant, Chakra, Carbon, Polaris), the headless libraries (Radix, Base UI, Ark, React Aria, shadcn) and the HTML and ARIA vocabulary. Log the name, the rejected candidates and why, so nobody proposes a rejected one again.
- The axes have fixed words:
  - `color` for what a thing means: `primary`, `danger`;
  - `variant` for how it is drawn at the same meaning: `subtle`, `outline`, `pill`;
  - `size` for a step of a scale: `sm` to `lg`;
  - `label` for the words assistive technology hears.
- A variant names the look, never the use: `block`, not `steps`. The words of the values repeat across components: brand-colored is `primary` everywhere.
- Two options that cannot both be true are one axis.
- One word per thing in the copy too: an action and an object are named the same on every screen.

## Spacing and geometry

- **The numbers run from the outer edge.** A border lies inside a box's numbers, as in design tools: a side with a border pads by its number less the border. A variant with no visible border keeps a transparent one, so its content stands where the bordered variant's does.
- **A surface keeps one inset,** the same on all four sides and on every surface of its kind: a card, a dialog, a stat. Narrow screens step it down through the token, never per component.
- **Never wider at the sides than above and below.** At every painted edge of a box that holds content, the block inset is at least the inline inset, read to the content nearest each corner, in the tallest state the content takes. Exempt:
  - a one-line control, such as a button, a field, a tab or a badge: its height is a control step, its block padding is 0, and its inline padding is at most half its height, where a pill's curve ends;
  - a page's gutter, which has no painted edge.
- **Tighter inside than outside.** The space within a group is smaller than the space between groups, so the eye groups what belongs together.
- **Nested corners are concentric.** An inner radius is the outer radius less the inset between the two edges, the border included. Once the inset reaches the outer radius, the inner corner keeps its own radius: the curves no longer read as one.
- **A corner is even:** a control in a corner of a painted box stands as far from both edges.
- **No pulls:** a box is never pulled by a negative margin to put its words on a text edge. What must stand on a text edge draws no box.
- **Rhyme.** Equal roles look equal: the same radius at the same depth, the same gap between siblings of one kind, edges shared across sections, one height for the controls of one row. A rhyme by accident is as wrong as a missing one: what means something different looks different.
- **Targets:** a control under a finger takes at least 44 by 44. A smaller control made for a pointer rises to the control height under a finger, or keeps a 44 hit area around its look.

## Contrast

- Text takes 4.5:1, large text (24px, or 18.66px bold) 3:1. Whatever identifies a control or carries meaning without words takes 3:1 against what stands next to it: a field's edge, an icon, the focus ring, a chart's mark (WCAG 1.4.3, 1.4.11). A disabled control is exempt.
- Check every pair on every surface it is drawn on, in every theme, tinted surfaces and photos included. Text over a photo gets a ground of its own.
- Contrast is measured by a tool over every screen, never judged by eye.

## Screens

- A screen per state a person can reach, at every width the product supports: rest, loading, empty, failed, saving, refused, read-only, and each open menu, sheet or dialog.
- Composed from the system's components and tokens only. A missing piece is a change to a component, never a one-off style on one screen.
- The canonical sample data and the product's real copy, never lorem ipsum, and only data the product has.
- Real elements and real accessibility in the markup: buttons, links, labels, one `h1`, headings in order.
- Each screen opens with a note: how a person reaches this state, what is pinned for the picture, and why it looks as it does.
- What comes later keeps its room: a loading shape is the usual size of its content, and an answer nobody pressed for never moves what stands in view.

## Designing something new

- Research first: how real products and established kits solve it, each claim checked at its source.
- Look for references where they are kept, each for what it is good at:
  - the look of whole pages: [Astryx templates](https://astryx.atmeta.com/templates), production page templates of Meta's open design system, and [shadcn/ui blocks](https://ui.shadcn.com/blocks);
  - real products' screens and flows: [Mobbin](https://mobbin.com), [Refero](https://refero.design), [Page Flows](https://pageflows.com);
  - one component across many systems, with its names: [The Component Gallery](https://component.gallery), then the systems' own guidelines (Material, Apple's Human Interface Guidelines, Carbon, Polaris, Atlassian, Primer);
  - patterns with research behind them: the [GOV.UK Design System](https://design-system.service.gov.uk), [Nielsen Norman Group](https://www.nngroup.com), [Baymard Institute](https://baymard.com) for forms and checkout;
  - accessible behaviour: the [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) and [Inclusive Components](https://inclusive-components.design).
- A reference gives the pattern and the idea, never its values: what is taken from it goes through this system's tokens, components and names like anything else.
- Draw several polished variants grounded in the research, each in the system itself, never one from memory.
- Measure each variant's geometry (heights, centres, gaps, clipping, overlaps) and have fresh eyes critique it. Fix what they find before showing it.
- Present whole screens or clean crops, with a recommendation and its alternative.

## Checking a change

- Build from the source. A token lint finds a missing token, a raw ramp step where a role belongs and a media query off the breakpoints. Each component's markup equals its snippet.
- Render every changed screen at every width and in every theme, and look at each.
- Measure rather than judge from a screenshot: overflow, clipped text, unknown classes, borders and alignment by computed values, contrast by a tool.
- An audit's findings are explained on the accessibility page, and a change adds none.

## The decision log

- Every call a reader might reverse is logged: what was decided, why, and the alternative rejected, by round and id.
- A later call that changes an earlier one says so on the earlier row.
- What was examined and left alone goes under "Judged and kept", so it is not raised again.
- Read the log before undoing anything.

## Examples

- **A staircase.** A top bar held a 48 language select, a 44 notification button and a 32 avatar, after one control was given a size step its neighbours lacked. One control height for the row, with the avatar filling its control's box, made it one line again.
- **A tinted focus ring.** The ring took the role's color: red on an invalid field, green on actions. Red on a field already edged in red said nothing new, and green on a greenish canvas fell to 1.25:1. One ring color for everything, and the error keeps its edge.
- **A look-alike.** A standalone "Add more details" button looked like a list row, so it was folded into the list row component as one more variant, and the component's root had to switch between a list item and a button. It became a button row that shares the list row's layout and nothing else.
