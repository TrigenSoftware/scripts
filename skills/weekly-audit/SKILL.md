---
name: weekly-audit
description: A regular audit of a project that agents build — the code against its skills, what nothing needs any more, the design and the product in step, and the tests against the product — run one check at a time on the user's word, with every finding verified, reported, decided item by item and only then fixed. Covers the reminder on the audit's day, the four checks and their order, running a check with subagents, the report, and what happens to a rule that turns out to be wrong. Apply when the user asks for an audit, a sweep, a consistency or drift check of the whole project, or on the project's audit day, even if the request only says "check everything" or "what did we miss".
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
    - audit
    - ai-agents
---

# Weekly Audit

A project that agents build grows fast, and each session sees only its own task: code drifts off a skill's rules, code nobody uses stays, a screen parts from its design, a feature has no test, and nobody notices. So the whole project is checked again on a regular day, as a whole, not only what changed.

## When

- The audit is regular: once a week unless the project says otherwise, on the day the project names in its own instructions.
- On that day, an agent's first answer in a session reminds the user that the audit is due, unless the user has said this week's is done.
- The audit starts on the user's word alone, and so does each of its checks.

## The checks

Four checks, one at a time, in this order:

1. **The code against the skills.** Every rule of every skill the project uses, its own and those of its libraries, over the whole codebase, not only what changed since the last audit.
2. **What nothing needs.** Code, styles, tokens, icons, translations, stories, states and dependencies that nothing reaches or that no screen needs any more, to be removed. What the design documents on purpose stays.
3. **The design and the product in step,** both ways: a screen, a component or a rule that one has and the other has not, or has otherwise. Only where the project has a design source.
4. **The tests against the product:** what the product does that no test covers, and a test that checks what the product no longer does, or does otherwise. Only where the project has tests.

## Running a check

- A check over a large codebase may be split among subagents, each with its part of the code and the rules it checks. Each finding is verified on its own before it is reported: by reading the code it names, by rendering the screen, by running the case. A finding nobody verified is not reported.
- Duplicates are merged, and findings are grouped into items a person can decide on: one rule broken in several places is one item.
- For the design check, show the design and the product side by side at the same width, cropped alike, with a mark where they differ. Words alone about a difference in a picture are hard to judge.

## The report and the decisions

- A check ends in a report: what was checked, what was found, the evidence for each finding, and what is proposed. The report goes in the chat or in a pull request's description; it is not committed.
- The findings are decided item by item, as the `item-by-item` skill says. A long list is decided first, each decision recorded, and fixed in a separate pass.
- When a finding shows that a rule itself is wrong, a skill's or the design's, the fix goes to the rule's source, not only to the code.
- The next check starts on the user's word. An agent never goes on to it by itself.
