---
name: form-states
description: How a form behaves while it waits, fails and refuses — the busy state that keeps focus and refuses input (`aria-disabled`, not `disabled`, `readonly`, `aria-readonly` or `aria-busy`), how each native control can be made to refuse in every browser, who passes busy to whom, how the wait is announced, a loading button, a server-rendered form that stays inert until it hydrates, where validation messages and refusals stand and how they are announced, files refused on choosing, and trimmed values. Apply when building or changing a form, a field, a submit or loading button, a validation message, a save that waits for the server, or any control that must not be pressed twice while an answer is on its way.
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
    - forms
    - ui
    - accessibility
    - ssr
---

# Form States

A form spends most of its life at rest, and the moments that decide whether it feels solid are the others: while it sends, when it fails, when it refuses a value. This skill covers those states. Where a refusal stands on the page, and why nothing moves under the pressed button, is the `layout-stability` skill's.

## Busy

While its form submits, or while it waits for an answer that a second press would race, a control is busy: it keeps focus and refuses input.

- **Busy renders `aria-disabled="true"` on the element that takes focus.** It is valid on every control role and announced by every screen reader, and the control stays in the Tab order, so focus is not thrown to the page.
- **Busy is not disabled.** A disabled control loses focus and leaves the Tab order; a disabled control is never busy.
- **Busy is not the busy marker of anything else:**
  - not `readonly`, which keeps its native meaning: a busy text field sets the native attribute itself, as its way to refuse typing;
  - not `aria-readonly`, invalid on a radio and a button, and ignored by Firefox and VoiceOver;
  - not `aria-busy`, which marks content being updated, and on a form can mute its error live regions in NVDA with Firefox.
- The same idea in other kits: `isPending` (React Aria), `focusableWhenDisabled` (Base UI), `disabledFocusable` (Fluent UI).

## How each control refuses

Checked in real browsers and devices:

- **A text field or a text area:** the native `readonly`. Focus and the Tab order stay in Chromium, Firefox, Safari and iOS, where the keyboard stays up; Android Chrome hides the keyboard.
- **A date or a time:** `readonly` does not hold. Firefox blurs the field and skips it on Tab, and the iOS picker still writes the value. Refuse in the capture phase instead: the edit keys, `mousedown` and `click`, and the keyup of the keys that open a picker, as Safari opens one on Space's keyup.
- **A select:** it has no `readonly`. Refuse in the capture phase the keydown of the arrows, Home, End, Page Up, Page Down, Space, Enter, F4, Alt with an arrow and printable keys, then `mousedown` and `click`. Refusing `click` alone fails on phones.
- **A checkbox, a radio, a button:** refuse the press. A radio group's arrow keys still move focus without choosing, which is accepted.
- **A value control's change:** swallow its change handler. A controlled field then goes back to its value; an uncontrolled one keeps what was written past the refusal.
- **What no event can refuse:** the iOS keyboard's Next and Previous, VoiceOver's press, iOS autofill, and on an iPhone a tap on the label of a select or a date. Accept these.

## Who passes busy

- Busy is an explicit prop of every control: the form's owner hands it to each control of the form from the same flag that sends the form.
- One path may pass it implicitly: the field wrapper that renders a control for the form reads the form's busy and hands it on. A composite field hands it to its parts.
- A control never reads busy from a context on its own: a control used outside a form, or in a form of another shape, would then be busy by accident.

## Announcing the wait

- The form says what it waits for in a status of its own, a live region: "Saving…", "Signing in…".
- Without it the wait goes unheard on macOS, iOS and Android: a change in the state of the focused control reaches no screen reader there.

## The loading button

- A button that shows a spinner while its action runs is a component of its own composing the button, so the spinner's code is loaded only where something waits.
- While it loads it takes no focus from a press, so the second press of a double press leaves focus where the first sent it.

## Before hydration

- A form the server renders is inert until the page hydrates: it takes no press, no focus and no key, and looks as it will. A submit before the script has come would send the form natively, its fields in the address, a password among them.
- Not a POST the server leads back to the page, which sends the form all the same; not `method="dialog"`, which sends nothing outside a dialog and closes one inside it; not React's form `action`, which holds the press until hydration but resets the fields after every answer.
- A form the browser renders, such as one in a dialog, is past hydration from its first render and is never inert.
- It stops a person, not a script. Check it on a production build: a dev server or a component workshop with no server never shows a form inert.

## Validation and refusal

- **A field's message stands in its hint's place,** so a field that can fail carries a hint, and the message takes over its line.
- **A new password's unmet rules** mark themselves in the field's checklist of rules, with `aria-invalid` on the field and no message under it.
- **The server's refusal of a value stands under the form's actions,** where the retry is. Every field it concerns takes `aria-invalid` and points to it with `aria-describedby`; when the refusal cannot say which field, such as a wrong email or password, both fields do. The marks last until the next attempt.
- **A refusal repeated is a new alert:** key the alert on the attempt, so it mounts again and is announced again.
- **No check runs on blur** that could move the button between its press and its release: a form checks on submit, and moves nothing above the button when it does.
- **After a failed submit,** focus goes to the first invalid field, with its text selected.

## Files

- A file over the size limit is refused as it is chosen. The field keeps what it held, the file chosen before too, and says why in its hint's place. No form then has to check the file on its save, and none can upload it by forgetting to.

## Values

- Text is trimmed at its ends as it is sent; the spaces inside stay. A field is not rewritten under the person's cursor while they type.
