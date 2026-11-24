---
name: ui-verification
description: How to check a UI change before calling it done — the change's twins, every language at the narrowest and widest width, the moments before, during and after an answer and on failure, sizes measured rather than eyed, both themes, input typed and pressed the way a person does it, the whole console, touch targets probed, a pixel regression check against the base branch, and server rendering checked on a production build. Apply after any change that renders (a component, a story, a page, a style, copy) and before reporting it finished, and when asked to check for regressions, even if the request only says "make sure it works".
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
    - testing
    - ui
    - regression
    - accessibility
---

# UI Verification

"It works in the story I changed" is where most defects slip through: the same pattern stays broken elsewhere, a longer language wraps, the moment a request is on its way jumps, a size is off by a pixel nobody measured. Check the breadth of a change, not only its centre. The tools are the browsers: the `chrome-mcp` skill for Chrome, the `browserstack-mcp` skill for Safari, Firefox and real devices.

## Before calling it done

- **The twins.** Search for the same pattern elsewhere, the same component in other places, a sibling component built alike, and give them the same fix.
- **Every language** the product ships, at the narrowest width it supports and at the widest: the longest language wraps first, a language with full-width glyphs falls back to other fonts.
- **Every moment of a request:** before the answer, while it is on its way, after it, and when it fails. A screen at rest says nothing about the wait.
- **Sizes by measurement,** with `getComputedStyle` and `getBoundingClientRect` against the design's scale, never by eye: a 1px border, a ring and an inset vanish in a screenshot.
- **Both themes,** and the states the theme changes: hover, pressed, selected, focus.
- **The other state** of whatever is shown by state: what a breakpoint hides, what a role does not show, a section that fails.

## As a person uses it

- Type into fields character by character, open lists, move with the keyboard, press with the pointer, and watch whether anything below jumps while you do.
- Read the console whole, unfiltered. A filter written for the errors you expect hides the one you did not.
- Look at what renders, not only at the facts a script returns: a script confirms what you thought to ask.

## Touch targets

- At a phone's width, probe the points around a control with `document.elementFromPoint` to find how far its target reaches. A target's look and its reach differ, and only the reach counts.

## Regression against the base

To check that a change broke no screen:

- **Two trees.** The base in a `git worktree` of the base branch, its `node_modules` linked from the repository; remove the worktree after.
- **The screens.** Build the component workshop (Storybook) in both trees, serve each, and shoot every page story in both at the same widths and themes.
- **Determinism, or the diff is noise:** seed `Math.random` in every document, fix the clock, turn animations and transitions off, prefer reduced motion, and wait for the story to finish rendering and the DOM to settle before the shot.
- **Compare:** byte-equal images are equal; diff the rest pixel by pixel, crop the differences and lay them out on sheets to look at. A pixel of antialiasing on a rounded corner differs between two shots of the same build too.
- **The server's pages.** Build both trees for production, serve them against the same seeded mock data, and walk every route: status, redirects, console errors, layout shift, and boxes moved or gone.

## Server rendering

- Check what the server renders on a production build: a dev server and a component workshop never show the server's HTML, hydration, or a form that is inert until the page hydrates.
- Compare the server's HTML with the first frame after hydration: what the server rendered must not change shape when the scripts arrive.
