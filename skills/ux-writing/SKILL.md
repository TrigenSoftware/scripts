---
name: ux-writing
description: How to write the words of an interface — voice, one word per thing, labels that earn their place instead of hierarchy made of kickers and badges, helper copy only where it changes understanding or outcome, buttons, errors, rollbacks, success, waiting and loading messages, typography of text, copy that grows in translation, dates, times and counts, and showing only data the product has — with a review gate for a screen's words. Apply when writing or reviewing any interface text, a label, a heading, a button, an error, an empty state, a toast, a hint, a title, a mockup's copy or a translation, even when the task is mainly about layout or code.
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
    - ux-writing
    - content-design
    - ui
    - accessibility
---

# UX Writing

The words are part of the design. A screen with a clear composition and the wrong words still fails the person using it: they read narration instead of acting, meet two names for one thing, or hit an error that says nothing about what to do next.

## Voice

- Plain, warm and specific. Sentence case for every title, label and button.
- One variant of the language for the whole interface, such as US English, and the same in its documentation.
- *You* is the person. *We* is the product, and only when the product failed: "We couldn't add the photo."
- No exclamation marks, no jokes in errors, no emoji in the interface's own words.

## One word per thing

- Every thing and every action has one name, used on its navigation item, its page's title, its buttons and its messages. A glossary lists them: the thing, the word to say, the words never to say.
- Use the words people know for the thing. The data model's and the team's words, such as record, entity, identity, context, flow or setup, appear only where people know the concept and need it for their task.

## Labels that earn their place

- Hierarchy comes from order, grouping, spacing and type, not from labels. An eyebrow, a kicker, a badge or a category stamp over every heading and card reads as machine-made, and makes people read narration before they can act. Fix a weak composition; never paper over it with more labels, dividers or cards.
- A visible label does at least one job:
  - it names a field or a control;
  - it tells where the person is, in navigation or in progress;
  - it states a state, a status or a consequence;
  - it tells apart what would otherwise be ambiguous.
  A label that does none of these goes.
- Labels that carry meaning are not decoration: a field's label, a table's header, a status message, a legal notice and a navigation's name stay, explicit and short. A name only assistive technology needs may stay visually hidden where showing it again would not help anyone who sees.

## Helper copy

- No sentence under a heading, a field, a card or a control just to narrate what the interface already shows.
- Add one only where it changes understanding or the outcome:
  - an action or a concept that would otherwise be ambiguous;
  - a need of assistive technology beyond the control's name and its relations;
  - a destructive, irreversible, private or public consequence;
  - a scope or a state that cannot be seen, such as a change that applies only today or alters something shared;
  - uncertainty, inference, provenance or freshness that could change a decision;
  - what an input requires, a validation, a way to recover, an important next step.
- Never to repeat the heading, to list the controls just below it, to describe an obvious interaction, or to make up for an unclear label: fix the label instead.
- Short is not the goal. Needed guidance is as long as the person needs; unneeded guidance is not there at all.

## Messages

- **A button is a verb and its object:** Add photo, Save changes, Delete album, Try again; never Submit or OK. A count goes into the label when it changes the action: "View 3 photos", "View 1 photo".
- **A record of an event says what happened,** from its data and nothing else: "Watered", "Payment refunded".
- **An error says what happened and what to do.** Where the service could not be reached, what to do is one sentence, the same in a refused form and in a page that did not load: "Check the connection, then try again." A waiting form's refusal adds that nothing entered is lost.
- **A change rolled back says it is back:** "We couldn't delete the album, so it's back in your library."
- **Success is a short statement in the past:** "Changes saved.", "Password changed."
- **Waiting:** a button that waits says what it does now, "Saving…", "Signing in…", and a hidden status says what waits, "Adding the photo…".
- **Loading:** one hidden status for the page, "Loading photos…" for a collection, "Loading the album…" for one thing.
- **The document's title** is the page's, then the product's: "Photos — Product".

## Typography of text

- Curly apostrophes and quotes (’ “ ”) and the ellipsis character (…), in every string.
- A quoted title stands in curly quotes; a person, a place or a thing is named as it is.

## Copy grows

- Translations run longer than English, often by a tenth overall and up to twice on short labels, while Chinese and Japanese land near English widths. So buttons size to their label, titles, rows and facts wrap, and a row of buttons stacks when it no longer fits.
- Check every screen in the longest language at the narrowest width. A word too long for its box breaks at soft hyphens, with `lang` on the text, and never overflows.

## Dates, times and counts

- In a list, a date is relative up to six days, in the language's own words, as the platform's relative format writes them: "3 hours ago", "yesterday". After that, the short date, "Oct 24", with the year when it is not this one.
- Lists of dated things are grouped by day: Today, Yesterday, This week, then a group per month.
- A detail page gives the whole date, and the time where it matters.
- One list never mixes formats. Every date is a `<time datetime>`, so it can be read by machines and formatted per locale.
- A count carries its noun: "12 photos", "4 updates in 7 days". A shortened "+2" is read in full to a screen reader: "and 2 more".

## Data

- A screen shows only what the product has. Nothing is invented to fill a layout.
- A mockup uses one canonical set of sample data and the product's real wording, never lorem ipsum, so every screen tells the same story.

## Review gate

Before approving a screen's words:

1. Read only its headings and labels. Remove repeated meaning.
2. Take away every eyebrow, kicker, badge and stamp. Bring back only those whose absence leaves a real gap in understanding or navigation.
3. Check that the screen still has its hierarchy from its composition.
4. Read the rest as the person using it. Reject internal terms, and labels that describe the design rather than help the task.
5. For every helper sentence, name the ambiguity, the risk, the access need, the invisible state or the recovery it serves. Remove it if there is none.
