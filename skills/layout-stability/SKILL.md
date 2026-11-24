---
name: layout-stability
description: How to keep a page from moving under the person using it — what a load, an answer or a failure may and may not move, how floating, kept room and swaps in place cure a shift, where refusals and messages stand, how waiting shapes are built, how a double press and focus sent far are handled, how classic scrollbars take room, and how to verify stability by comparing boxes rather than trusting CLS alone. Apply when adding loading states, skeletons, async results, errors, toasts, controls shown by state, steps that change a dialog, or page-level scroll and scrollbar styles, and whenever a layout shift or a jump is reported.
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
    - performance
    - cls
    - accessibility
---

# Layout Stability

A person aims at a control. When something moves under the pointer or the finger, they miss it, or they press what took its place. web.dev's Cumulative Layout Shift counts such moves. This skill goes past the metric where the metric is blind, and stops short of it where holding room would cost more than the move.

## What may move

- A load, or an answer nobody pressed for, never moves what stands in view.
- A person's own press may move what stands below the control they pressed: they expect it, and web.dev counts no shift within 500 ms of a discrete input (a click, a tap, a key; not a scroll or a hover). The pressed control and everything above it hold, and the wait shows.
- Holding the tallest room of every state is not the cure: blank room under a short state costs more than the expected move. A shape matches the usual size of what comes, never its largest.
- Errors are rare. Build no machinery to hold room on a failure-and-retry path: on Try again the refusal goes and the ordinary wait shows, and a new failure shows the refusal again.

## The cures

In this order of preference:

1. **Float it.** What comes with no press stands over the page rather than in its flow: a toast, a floating button, a popover.
2. **Keep its room** with a shape of the usual size, drawn in the parts the content will draw.
3. **Swap in place.** The content and its placeholder share one grid cell: the placeholder keeps the room while there is no content and stays, unseen, under it after. The browser measures the room, never a number typed for one language. With several placeholders in the cell, the tallest keeps it.

## Where things stand

- A refusal and a form's success stand under its actions, so the pressed button, which is the retry, holds. In a dialog, whose actions stand in its foot, the message stands at the body's end and the dialog grows round it: that move follows the person's own press.
- A field's message stands in its hint's place, so a field that can fail carries a hint. A check that would move the button between its press and its release does not run on blur.
- A control takes the width of what it shows as its words change, such as Save and Saving…: a move to the side costs little beside a move down. What must not change is the number of rows a wrapping group takes: where changing words could wrap a row, the main action takes a row of its own.
- A list's end holds the wait for the next page, a failure with Try again, or the last word.
- A dialog that changes with what is chosen in it, its steps or its types, keeps one height.

## Waiting shapes

- A page's shape while its code loads is the page with nothing known: all grey, no words, built from the parts the page shows while its data comes, so the two waits are one shape.
- What the page before already brought stands real from the first frame: a header, a name, the way back.
- A menu opened before its list has come holds one line that says so and nothing to press. Anything shown ahead of the list would move as the list lands over it.

## Presses and focus

- **A double press.** The second press of a double press counts only on the control that took the first, whatever moved under it: a dialog that closed, a page that changed, a bar that came. Guard it once, at the app's root, by `event.detail` on `mousedown`, `click` and `dblclick`.
- **Focus sent far.** A press that sends focus to what can stand far from it, such as a heading or a list's last row, keeps the reader's place under a pointer: `element.focus({ preventScroll: event.detail > 0 })`. A keyboard's press follows focus.
- **What sticks at the page's end** declares its height in the root's `scroll-padding`, so an element scrolled into view by focus stops clear of it.

## Scrollbars

- A classic scrollbar takes room that media queries count and the layout does not: at a 600 breakpoint the content is 585 wide. Check every layout with the bar showing. Headless Chrome hides scrollbars unless it starts without `--hide-scrollbars`, and macOS hides them until it is set to always show them.
- The page keeps the bar's room, so nothing moves between a short page and a tall one: `html { overflow: auto scroll }`, in the shorthand, as Safari 18 has no logical `overflow-block`. Not `scrollbar-gutter: stable` on the root: nothing paints over a gutter, so a modal's backdrop would leave a strip of the page beside it.
- A modal's scroll lock gives the bar's width back as padding, so what stands in the flow holds, and what is fixed reads the same width.
- A scrolling box keeps its bar's room inside its own padding, so a bar that comes reflows nothing.
- Scroll anchoring stays on: it brings the reader's place back on Back. So a `min-block-size` that holds room matches a shape, never a loaded list, and nothing window-tall stands under a list that grows as it scrolls.
- A pointer gets a thin bar on what scrolls sideways; touch keeps none.
- A scroller with nothing focusable inside takes focus itself, with `tabindex="0"` and a name, or Safari's Tab skips it.

## Verifying

- Compare the boxes of the two states, before and after a load, a swap or a press, with `getBoundingClientRect`, at the narrow and the wide width and in each language. The Layout Instability API, and so CLS, does not see a replaced node or a scroll clamp, and leaves out what comes within 500 ms of a press.
- Check the other state of whatever is shown by state: a control hidden at one breakpoint, a section that fails, the wait before an answer.
