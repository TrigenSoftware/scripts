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

## Model, Reasoning Effort And Speed

For a new session, ask the user (via `AskUserQuestion`) which model, which reasoning effort, and which speed to use, in a single prompt with three questions. When the user expresses no preference, default to `gpt-6-astra` at `high` and the standard speed.

Availability differs between CLI versions and accounts. Check what the installed CLI actually offers with `codex debug models`, which renders the raw model catalog as JSON — per model: `supported_reasoning_levels`, `default_reasoning_level`, `service_tiers`, `visibility` (`list` = shown in the picker, `hide`), `supported_in_api` and `upgrade` (deprecation notice naming the replacement). The list below is from codex-cli 0.153.4.

Models, in picker order:

- `gpt-6-astra` — GPT-6, released 2026-09-03: most capable model for complex, demanding work; text and image input; top of the picker (default)
- `gpt-5.6-sol` — reliable agentic workhorse for everyday tasks
- `gpt-5.6-terra` — balanced agentic coding model for everyday work
- `gpt-5.6-luna` — fast and affordable agentic coding model
- `gpt-5.5` — proven previous-generation model for coding and general work
- `gpt-5.4-mini` — small, fast, cost-efficient model for simpler tasks; deprecated soon, the catalog names `gpt-5.6-luna` as its replacement
- `gpt-5.3-codex-spark` — ultra-fast coding model (~1.5k tokens/s) with a 128k context instead of 272k; `supported_in_api: false`, so ChatGPT sign-in only
- hidden from the picker (`visibility: hide`) but callable: `gpt-reserve` (fast and affordable fallback, up to `max`) and `codex-auto-review` (internal auto-approval review model)

`gpt-5.4` and `gpt-5.3-codex` are gone from the catalog.

Reasoning effort — `low`, `medium`, `high`, `xhigh`, `max`, `ultra`:

- This skill defaults to `high`. The CLI's own default differs per model (`low` for `sol`, `high` for `codex-spark`, `medium` for `astra` and the rest), so always pass `model_reasoning_effort` explicitly.
- `max` needs GPT-6 or a GPT-5.6 model; `ultra` is only on `astra`, `sol` and `terra` (`luna` caps at `max`); `gpt-5.5`, `gpt-5.4-mini` and `codex-spark` cap at `xhigh`.
- `ultra` is maximum reasoning with automatic task delegation — slowest and most expensive, reserve it for the hardest jobs.
- If the chosen effort exceeds the chosen model's maximum, fall back to that model's highest supported effort and tell the user.

Speed — the service tier the turn runs on, set with `service_tier`:

- Standard speed is the default and needs no flag.
- `priority` is the Fast tier: 1.5x speed at increased usage. It's offered by `gpt-6-astra`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna` and `gpt-5.5`.
- `gpt-5.4-mini` and `gpt-5.3-codex-spark` have no Fast tier. When the chosen model doesn't offer one, skip the speed question and tell the user.
- `~/.codex/config.toml` may already set `service_tier`, which then applies to every run. To force standard speed for one run, pass `--config service_tier="standard"` — any tier the model doesn't offer resolves to the standard one.

## Assembling The Command

Select the sandbox mode required for the task; default to `--sandbox read-only` unless edits or network access are necessary. Always use `--skip-git-repo-check`.

Available options:

- `-m, --model <MODEL>`
- `--config model_reasoning_effort="<low|medium|high|xhigh|max|ultra>"`
- `--config service_tier="priority"` for the Fast tier; omit it for standard speed
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
| Resume recent session | Match the original | `echo "prompt" \| codex exec --skip-git-repo-check resume --last 2>/dev/null` (flags go before `resume`) |
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

- A resumed session keeps the conversation history, but not the settings: model, reasoning effort, and speed are resolved again from `~/.codex/config.toml` plus whatever flags you pass. To continue with the settings the session started with, repeat the same `-m`, `model_reasoning_effort`, and `service_tier` flags.
- All flags have to be inserted between `exec` and `resume`.
- `--last` resolves the most recent session for the current working directory. Run it from the directory the original session used, otherwise it can silently start a fresh session instead of continuing one.
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
- Restate the chosen model, reasoning effort, speed, and sandbox mode when proposing follow-up actions.

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
