---
name: item-by-item
description: How to work through a long list with the user one item at a time — audit findings, review comments, observations, a checklist, a backlog — when the user asks to go through it iteratively, item by item or point by point. Each item is presented with its evidence and lettered options, waits for the user's decision, is built locally, is handed over for review and fixed until approved, and is committed and pushed only when the user says so. Covers the decisions-only pass, the progress record, the scope of an item, and what never happens without the user's word. Apply whenever the user asks to take a list iteratively or one by one, or answers items with letters or "ok / not ok", even when the skill is not named.
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
    - workflow
    - review
    - collaboration
---

# Item by Item

A long list of decisions is too much to take in at once: twenty findings in one report get skimmed, and the answers come back vague. One item with its evidence and a proposal is easy to answer, and a change reviewed while it is small is reviewed for real. So when the user asks to go through a list iteratively, the user decides every item, reviews every change, and nothing moves on without their word.

## The loop

Take the items in the list's order, one at a time:

1. **Present.** One item per message, as [Presenting an item](#presenting-an-item) says. Build nothing yet, not even a quick preparation: the answer may change what gets built.
2. **Decide.** Wait for the user. A letter or "ok" is the go-ahead for that option. "Not ok", or an instruction of their own, replaces your proposal: follow it, or present the item again if it leaves a question open. Write the decision down at once, before anything else (see [Progress record](#progress-record)).
3. **Build.** Do the decided option, locally, and no more. Follow the repository's own rules and skills, and verify the change the way the repository verifies changes: its tests, a browser, a real device. Fix a small defect you find inside the item's own scope as part of it. Anything beyond goes into the hand-over as a proposal.
4. **Hand over and go on.** Say what changed (the files, the size), how it was verified, where to see it (a story, a URL, a command), and where the build departs from the decision and why. In the same reply, present the next item: the user reviews the one and decides the next in a single answer, and the pass never waits on a bare "next". Stop after the hand-over only when the user asked to review each item before moving on, or when the item was the list's last.
5. **Review.** The user's answer can carry remarks on the item handed over beside the decision on the next one. Fix the remarks first and say so in the next hand-over: an item stays open until its remarks are fixed.
6. **Commit and push, only when told.** When the user says to commit (or said at the start that every approved item is committed), commit what they named in the repository's message convention and push it. Otherwise leave the changes uncommitted in the working tree.

## Presenting an item

- The item's number out of the list's length, "2 of 12", at the head of the message, so the user always sees how far the pass has come and how much is left.
- What happens now, and why it matters to the person using the product.
- The evidence the user can check without reproducing it: a screenshot, a measurement, a log line, a link to the code.
- The options, as letters, with your proposal marked, so a letter is a whole answer. An item with several questions numbers them inside each option, so "a 1, b 2" answers them all.

> **a) (recommended)** keep the toast and lift the floating button over it
>
> **b) (alternative)** hide the toast while a dialog is open

## Decisions first

Sometimes the user wants every decision before any code ("just remember the answers, the code comes later"). Then the loop is shorter:

- present an item, take the answer, record it, and present the next item in the same reply;
- change no code during this pass;
- when the user starts the code pass, build from the recorded decisions, in the grouping the user asks for, and hand over for review as above.

## Scope of an item

- An item's options, explanations and questions come when its turn comes. Do not raise item 8's questions while on item 7.
- The decided option is the whole scope. An approved plan is not an approved build of the next thing: whatever else the work turns up becomes a proposal in the hand-over, or a new item appended to the list.
- When building shows that the decided option cannot be done as decided, say so in the hand-over with the reason. Never change the decision silently.
- An item too big to review in one sitting is split into sub-items before anything is built, and the split is proposed first.
- When an item depends on someone else's fix, such as a library's bug or another team's API, report it with the evidence instead of working around it, mark the item as waiting, and go on only on the user's word.
- During a long step inside an item, such as subagents, a full verification or a regression run, collect the questions that come up and ask them together once the step is done.

## The working tree

- Commit, push, open a pull request or change one only when the user says so for that change. Saying so once is no licence for later items.
- Never move your own uncommitted work out of the tree with a stash, a checkout or a temporary branch: the user may be watching the tree and staging by hand. If a step must be split, name which files form which part.
- Never unstage or reset what the user staged. When their staged files and yours mix, ask how to commit them.
- A report of the pass, a progress table or notes are not committed unless the user asks: they go in the chat, a pull request's description, or an untracked file.

## Progress record

Keep the list with each item's state where the work keeps its notes (a notes file, the agent's memory, the pull request's description):

| # | Item | Decision | State |
|---|------|----------|-------|
| 1 | Toast hides the floating button | a) lift the button | pushed `abc1234` |
| 2 | Date never updates | a) minute clock | built, in review |
| 3 | Empty state wording | — | next |

- Write the decision when it is given, and the state after each step: decided, built, in review, committed with its hash, waiting with its reason.
- Answer "where are we" from this record.
- After a context reset or in a new session, read the record before doing anything, and continue from the first open item.

## Example

> **User:** let's go through the 12 review findings iteratively
>
> **Agent:** **1 of 12. A toast hides the floating button.** On a phone, a toast stands over Add update for five seconds and takes the press meant for the button (screenshot). a) (recommended) lift the button above the toasts while they show; b) (alternative) let the toasts stand above the button.
>
> **User:** a
>
> **Agent:** *(records the decision, builds, verifies)* 1 of 12 is done locally, not committed: 3 files, +41 −12. The button rises over a toast and comes back when it goes, checked at 375 and 1440 in Chrome; story `FloatingWithToast`.
>
> **2 of 12. A date never updates.** "Updated 2 minutes ago" stays as it is while the page is open (screenshot after 10 minutes). a) (recommended) a clock store that ticks every minute while the page is visible; b) (alternative) absolute dates only.
>
> **User:** a. On 1: the button jumps, let it ease
>
> **Agent:** *(fixes item 1, records item 2, builds it)* 1 of 12: the button now eases over the toast's own duration. 2 of 12 is done locally: … **3 of 12.** …
>
> **User:** commit and push 1 and 2
>
> **Agent:** Pushed `abc1234` with items 1 and 2.
