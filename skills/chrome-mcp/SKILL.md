---
name: chrome-mcp
description: Set up and use the Chrome DevTools MCP server (chrome-devtools-mcp, tools mcp__chrome-devtools__*), a real Chrome the agent drives. Reach for it whenever a browser can answer instead of a guess. Use it after any change that renders (component, story, page, CSS) before reporting it done, when the user asks for a screenshot or to see something, to check hover, focus and other states or computed styles, to reproduce a visual bug, to measure performance, or to settle how a browser API behaves with a probe page. Apply also when installing the server, running it with headless Chrome in a Docker dev container, or when it fails to connect.
license: MIT
compatibility:
  - Claude Code
metadata:
  author: dangreen
  tags:
    - mcp
    - chrome
    - browser
    - screenshots
    - ui-testing
---

# Chrome DevTools MCP

The Chrome DevTools MCP server gives the agent a real Chrome: it opens pages, takes screenshots and accessibility snapshots, runs scripts in the page, reads the console and network, emulates viewports, color schemes and throttling, records performance traces and runs Lighthouse. This skill says when to reach for it, what was learned using it, and how to set it up. What each tool does is in the tool descriptions and in the upstream skills (`npx skills add ChromeDevTools/chrome-devtools-mcp`).

## When to use it

Whenever a browser can answer, ask the browser. In particular:

- **Before reporting UI work as done.** Open every story or page the change touches. Green unit tests in jsdom or happy-dom show neither the layout nor what the dev server actually serves.
- **When the user asks for a screenshot or to see something.** This server is the tool for rendering pages, HTML prototypes and mockups included.
- **For interaction states.** Trigger the real hover, press, keyboard focus, disabled or busy state and read the result: a screenshot at rest proves nothing about states.
- **For subtle CSS.** 1px borders, focus rings, alignment and overflow hide in a zoomed-out screenshot: measure them with `getComputedStyle` and `getBoundingClientRect`.
- **For a visual bug the user reports.** Reproduce it, try the fix live with an injected style, then write it to the source and confirm.
- **For questions about browser behavior.** Which `srcset` candidate wins, whether a DOM API throws, what a property returns: run a probe page (`data:text/html,…`) instead of answering from memory or specs.
- **For performance.** Measure in this Chrome, with a bench page or `performance_start_trace`, never in Node with a fake DOM.

Chrome is one engine. For Safari, Firefox, Edge and real mobile devices use the `browserstack-mcp` skill.

## Rules

- **Own tab.** Open your own page with `new_page`, pass its `pageId` to every call and close it when done. Never navigate or close tabs you did not open: subagents and parallel tasks of the session share one browser. Agents working in parallel also pass their own `isolatedContext` name to `new_page`, so they share no cookies or storage.
- **The user's dev servers belong to the user.** Before starting Storybook or a dev server, probe the port (`curl -s -o /dev/null -w '%{http_code}' localhost:6006`). If it answers, use it and never restart or stop it. If you start your own, use another port, run it in the background and stop it by PID when done: `pkill -f` with a pattern from your own command line kills your shell too.
- **Open stories directly.** `http://localhost:6006/iframe.html?id=<story-id>&viewMode=story` renders one story without the Storybook UI, and `/index.json` lists the ids. A dev server compiles on the first request, so give the first navigation a long `timeout`, such as 60000.
- **Assert with scripts, look with screenshots.** Check facts with `evaluate_script`: computed styles, boxes, `matches(':hover')`, `scrollWidth` against `clientWidth`. Then read `list_console_messages` for errors. Keep each script short, a long loop runs into the protocol timeout.
- **Screenshots go to files.** Save them with `filePath` into the scratchpad and `Read` them to look. Cover the widths that matter (1440, 375 and 320 through `emulate` or `resize_page`) and both color schemes.
- **Hand the user the image, not a description.** When the user asks for a screenshot, reply with a markdown link to the file. Links to files in the workspace open right in the editor, so copy shots meant for the user from the scratchpad into the workspace, and keep them out of commits unless asked. `SendUserFile`, where available, reaches the user's other devices, not the editor.
- **Measure performance on a quiet machine.** After a rebuild reload with `ignoreCache`, make a warm-up run and take the numbers from the second one, and never measure while builds or tests run.
- **Heavy parallel rendering skips the MCP.** When many agents take many screenshots, let each one drive its own headless Chrome with `playwright-core`, using the binary and flags below, instead of queueing on the one shared browser.

## Setup

### Desktop

With Chrome installed and a display, the defaults work: Chrome opens a window with a persistent profile.

```sh
claude mcp add chrome-devtools --scope user -- npx -y chrome-devtools-mcp@latest
```

### Docker dev container

In a container with no display that runs as root, like [TrigenSoftware/dev-container](https://github.com/TrigenSoftware/dev-container):

```sh
claude mcp add chrome-devtools --scope user -- npx -y chrome-devtools-mcp@latest \
  --headless \
  --isolated \
  --executablePath /usr/local/bin/google-chrome \
  --chromeArg=--no-sandbox \
  --chromeArg=--disable-dev-shm-usage
```

| Flag | Why |
|------|-----|
| `--scope user` | One server for every project on the machine. |
| `--headless` | There is no display. |
| `--isolated` | Each Claude Code session starts its own server. With the shared default profile the second one fails with `The browser is already running for …`, and a temporary profile also starts every session without old cookies and storage. |
| `--executablePath` | The Chrome that Playwright installs, which has builds for amd64 and arm64. Google Chrome has no Linux arm64 build. |
| `--chromeArg=--no-sandbox` | Chrome does not start as root with its sandbox on. |
| `--chromeArg=--disable-dev-shm-usage` | Docker gives `/dev/shm` 64 MB, shared by every browser in the container. Without the flag parallel launches crash and wide screenshots hang with `Page.captureScreenshot timed out`. |

The image installs that Chrome:

```dockerfile
ENV PLAYWRIGHT_BROWSERS_PATH=/usr/local/share/ms-playwright
RUN npx -y playwright@latest install chromium \
    && ln -s "$(find $PLAYWRIGHT_BROWSERS_PATH -type f -name chrome -path '*chromium-*')" /usr/local/bin/chrome \
    && ln -s /usr/local/bin/chrome /usr/local/bin/google-chrome
```

Google collects usage statistics of the server by default, and performance tools send trace URLs to the CrUX API: `--no-usage-statistics` and `--no-performance-crux` turn that off.

### Check

- `claude mcp list` shows `chrome-devtools: … ✔ Connected`.
- Servers start with the session: after adding or changing one, restart the session or reconnect it in `/mcp`.
- The tools may be deferred: load them with ToolSearch, for example `select:mcp__chrome-devtools__new_page,mcp__chrome-devtools__take_screenshot`.

### When it fails

- **`Connection closed` at session start.** The server died while starting. Run the command by hand (`npx -y chrome-devtools-mcp@latest --help`) to see the error. A common cause is the `npx` cache: `@latest` installs each new release at the next start, and an install cut off by the startup timeout leaves a broken `~/.npm/_npx/<hash>` that fails every start. Delete that directory, run the command once by hand to reinstall, then reconnect in `/mcp`.
- **`Browser was not found at the configured executablePath`.** Chrome is gone, for example after the container was recreated from an image without it: install it as above.
- **`… timed out. Increase the 'protocolTimeout' …`.** Either `/dev/shm` ran out (see `--disable-dev-shm-usage`) or a script ran too long: split it.
- **The server is down but the task needs a browser.** Drive Chrome from a scratchpad script with `playwright-core`, taken from a repo that already has it in `node_modules` or installed in the scratchpad: `chromium.launch({ executablePath: '/usr/local/bin/google-chrome', args: ['--no-sandbox', '--disable-dev-shm-usage'] })`.
