---
name: native-overlays
description: How to build dialogs, sheets, popovers, menus and tooltips on the platform's own top layer — `<dialog>` with `showModal()` and the Popover API instead of portals and z-index — and the traps met on the way: what a modal makes inert, Chrome's close watcher letting the third Escape through, a dialog that animates out while still modal, where focus goes on opening and after closing, light dismiss when the focused control disappears, placement where CSS anchor positioning is missing, scroll lock with the scrollbar's width, sheets that outlive their bar, a menu's keyboard and a tooltip that names nothing. Apply when building or changing any dialog, sheet, menu, popover, picker, combobox list or tooltip, or when one fails to close, closes too soon, loses focus or traps the page.
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
    - dialog
    - popover
    - accessibility
---

# Native Overlays

The browser has its own layer for what stands over the page. A modal `<dialog>` and a popover go into the top layer, above everything and unclipped by any ancestor, and the platform brings with it what libraries used to rebuild: an inert page behind a modal, Escape, focus given back, light dismiss. Use it, and know where it stops.

## Native first

- **A modal is a `<dialog>` opened with `showModal()`.** The browser makes the rest of the page inert, closes the dialog on Escape through its `cancel` event, and gives focus back to the element that had it when the dialog closes.
- **A menu, a picker, a combobox's list or a tooltip is a popover** (`popover`, `showPopover()`): in the top layer, with no portal. Prefer the platform's light dismiss, `popover="auto"` with `popovertarget` on its button, before rebuilding it in script.
- No portals and no z-index ladder: what is in the top layer stands in the order it was opened.

## What a modal makes inert

- Everything outside the open modal is inert, even what stands in the top layer: a popover, a tooltip, a toast region outside the dialog can no longer be pressed or reached.
- So whatever a person must reach while a modal is open lives inside it: a tooltip for a control in a dialog is put inside that dialog, and a popover opened from a dialog is the dialog's descendant.

## Escape and cancel

- Chrome's close watcher honours `preventDefault()` on a dialog's `cancel` only while the page has user activation to spend: two Escapes are held, and the third closes the dialog anyway.
- A dialog that must not close, such as one whose save is in flight, does not rely on `preventDefault()` alone: its owner keeps the open state, and the dialog opens itself again when it is closed against that state.

## Leaving

- A dialog that animates out stays open while it leaves, marked as closing, and is closed once its transitions have run. Browsers without the `overlay` transition, Safari among them, take it out of the top layer at once otherwise, and it vanishes.
- While it leaves it stays modal, the page still inert, and as it closes it gives focus back to its opener.
- So focus meant to go anywhere else after a close, such as a page's heading after a save, moves once no dialog is leaving. Never on a timer of the animation's length, and never by closing without the way out.

## Focus on opening

- With a keyboard, focus goes to the control marked `autofocus`, or to the first control.
- Under a finger (`pointer: coarse`), the dialog opens with focus on itself or its heading: a field focused at once raises the on-screen keyboard over half the dialog, and a screen reader starts from the top.

## Light dismiss

- A popup that closes when focus leaves its root misses one case: a control that goes away as it is pressed, such as Clear, drops focus to the body with no `blur` in Safari, and a click outside then takes no focus out of the root. Close it on a document `click` outside the root as well, listened in the capture phase. A `click`, not a pointer going down, so a finger that scrolls the page leaves it open.
- A press on the popup's own surface, its padding or a gap between its parts, must not send focus to the body and close it: cancel the `mousedown` default there, unless the press lands on a control, a field or anything that takes focus.

## Placement

- Place a popover by CSS anchor positioning where the browser has it.
- Where it does not, as in Safari 18, decide what the reader gets and make it work: a menu standing in the middle of the window, where the top layer puts a popover, a combobox's list in the flow under its field.
- Check the oldest browser the product supports, for real, not from a support table.

## Scroll lock

- A modal locks the page's scroll from its own stylesheet while it is open: `html:has(dialog:modal) { overflow: hidden }`.
- The lock gives the scrollbar's width back as padding on the root, measured when the lock starts, so the page does not shift sideways. What is fixed reads the same width.

## Sheets

- A sheet opened from a control that only a narrow layout shows closes when the window grows past that width: the bar that held it is gone, and a modal nobody sees would keep the page inert.

## A menu's keyboard

- Enter, Space or Down opens a menu on its first item; Up opens it on its last.
- A menu whose items are all radio items opens on the checked one, as MUI's selected menu and React Aria do. A mixed menu opens on its first item.

## Tooltips

- A tooltip names nothing. The control is named by its own `aria-label`, and the tooltip shows the same words to a pointer, hidden from assistive technology, which hears the name once.
- It shows after a short beat on hover, and at once on keyboard focus. A press, a key, a scroll or a resize hides it.
- Escape hides the tooltip alone: its keydown is consumed, so a dialog under it stays open.
