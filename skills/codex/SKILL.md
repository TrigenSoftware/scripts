---
name: codex
description: Guide for driving the OpenAI Codex CLI (codex exec, codex resume) — model and reasoning effort selection, sandbox modes, resume syntax, execution timeouts, and critical evaluation of Codex output. Apply when the user asks to run Codex CLI or references OpenAI Codex for code analysis, refactoring, or automated editing.
license: MIT
compatibility:
  - Claude Code
metadata:
  author: dangreen
  tags:
    - codex
    - cli
    - ai-agents
---

# Codex

Use this skill to run the OpenAI Codex CLI (`codex exec`, `codex resume`) for code analysis, refactoring, or automated editing.

## Model And Reasoning Effort

For a new session, ask the user (via `AskUserQuestion`) which model and which reasoning effort to use, in a single prompt with two questions. Resumed sessions inherit the prior model and effort, so don't ask again. When the user expresses no preference, default to `gpt-5.6-sol` at `high`.

Models:

- `gpt-5.6-sol` — frontier, most capable (default)
- `gpt-5.6-terra` — balanced, everyday
- `gpt-5.6-luna` — fast and affordable
- legacy, kept for compatibility: `gpt-5.5`, `gpt-5.4`, `gpt-5.4-mini`, `gpt-5.3-codex-spark`, `gpt-5.3-codex`

Reasoning effort — `low`, `medium`, `high` (default), `xhigh`, `max`, `ultra`:

- `max` and `ultra` require a GPT-5.6 model; `ultra` is only on `sol`/`terra` (`luna` caps at `max`); legacy models cap at `xhigh`.
- `ultra` is maximum reasoning with automatic task delegation — slowest and most expensive, reserve it for the hardest jobs.
- If the chosen effort exceeds the chosen model's maximum, fall back to that model's highest supported effort and tell the user.

## Assembling The Command

Select the sandbox mode required for the task; default to `--sandbox read-only` unless edits or network access are necessary. Always use `--skip-git-repo-check`.

Available options:

- `-m, --model <MODEL>`
- `--config model_reasoning_effort="<low|medium|high|xhigh|max|ultra>"`
- `--sandbox <read-only|workspace-write|danger-full-access>`
- `--full-auto`
- `-C, --cd <DIR>`
- `--skip-git-repo-check`
- `"your prompt here"` as the final positional argument

Quick reference:

| Use case | Sandbox mode | Key flags |
|----------|--------------|-----------|
| Read-only review or analysis | `read-only` | `--sandbox read-only 2>/dev/null` |
| Apply local edits | `workspace-write` | `--sandbox workspace-write --full-auto 2>/dev/null` |
| Permit network or broad access | `danger-full-access` | `--sandbox danger-full-access --full-auto 2>/dev/null` |
| Resume recent session | Inherited from original | `echo "prompt" \| codex exec --skip-git-repo-check resume --last 2>/dev/null` (no flags allowed) |
| Run from another directory | Match task needs | `-C <DIR>` plus other flags `2>/dev/null` |

Run the command, capture stdout/stderr (filtered as appropriate), and summarize the outcome for the user.

## Stdout, Stderr And Stdin

By default, append `2>/dev/null` to all `codex exec` commands to suppress thinking tokens (stderr). Only show stderr if the user explicitly requests to see thinking tokens or if debugging is needed.

`codex exec` always reads stdin and concatenates it with the positional prompt — even when the prompt is fully supplied as a positional argument. If stdin is not closed, codex blocks forever. When invoking from a harness (background tasks, hooks, scripts where stdin is not a TTY but also not closed), explicitly redirect stdin by appending `</dev/null`:

```bash
codex exec --skip-git-repo-check --sandbox read-only "prompt" </dev/null 2>/dev/null
```

Symptom of getting this wrong: zero bytes of stdout, zero CPU accumulated, process appears hung indefinitely.

## Resuming A Session

When continuing a previous session, pipe the new prompt via stdin:

```bash
echo "your prompt here" | codex exec --skip-git-repo-check resume --last 2>/dev/null
```

- The resumed session automatically uses the same model, reasoning effort, and sandbox mode from the original session — don't pass configuration flags unless the user explicitly requests them (e.g. specifies the model or the reasoning effort when asking to resume).
- All flags have to be inserted between `exec` and `resume`.
- After Codex completes, inform the user: "You can resume this Codex session at any time by saying 'codex resume' or asking me to continue with additional analysis or changes."

## Execution Timeouts

Codex produces no intermediate output — it writes the result only at completion. If the process is killed before finishing, the output file is silently empty (no error).

Prefer running synchronously — it eliminates timeout risk entirely, and the conversation waits for the result anyway. If running in background, set the execution timeout based on reasoning effort:

| Reasoning effort | Timeout |
|------------------|---------|
| `low` | 150s |
| `medium` | 300s |
| `high` | 600s |
| `xhigh` | 1200s |
| `max` | 1800s |
| `ultra` | 1800s |

## Following Up

- After every `codex` command, immediately use `AskUserQuestion` to confirm next steps, collect clarifications, or decide whether to resume with `codex exec resume --last`.
- Restate the chosen model, reasoning effort, and sandbox mode when proposing follow-up actions.

## Critical Evaluation Of Codex Output

Codex is powered by OpenAI models with their own knowledge cutoffs and limitations. Treat Codex as a colleague, not an authority:

- Trust your own knowledge when confident. If Codex claims something you know is incorrect, push back directly.
- Research disagreements using WebSearch or documentation before accepting Codex's claims. Share findings with Codex via resume if needed.
- Remember knowledge cutoffs — Codex may not know about recent releases, APIs, or changes that occurred after its training data.
- Don't defer blindly — Codex can be wrong. Evaluate its suggestions critically, especially regarding model names and capabilities, recent library versions or API changes, and best practices that may have evolved.

When Codex is wrong:

1. State your disagreement clearly to the user.
2. Provide evidence: your own knowledge, web search, docs.
3. Optionally resume the Codex session to discuss the disagreement. Be transparent about the sender: disclose your own actual model name, so Codex knows the follow-up comes from the AI agent coordinating the session rather than from the human user:

   ```bash
   echo "Follow-up from <your own model name>, the AI agent coordinating this session. I disagree with [X] because [evidence]. What's your take on this?" | codex exec --skip-git-repo-check resume --last 2>/dev/null
   ```

4. Frame disagreements as discussions, not corrections — either AI could be wrong.
5. Let the user decide how to proceed if there's genuine ambiguity.

## Error Handling

- Stop and report failures whenever `codex --version` or a `codex exec` command exits non-zero; request direction before retrying.
- Before you use high-impact flags (`--full-auto`, `--sandbox danger-full-access`, `--skip-git-repo-check`), ask the user for permission using `AskUserQuestion` unless it was already given.
- When output includes warnings or partial results, summarize them and ask how to adjust using `AskUserQuestion`.
