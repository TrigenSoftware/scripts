---
name: browserstack-mcp
description: Set up the BrowserStack MCP server (@browserstack/mcp-server, tools mcp__browserstack__*) and use BrowserStack's real browsers and devices whenever the answer depends on an engine other than the local Chrome, such as Safari and iOS, Firefox, Edge with Windows fonts, or Android. Reach for it before stating how Safari or a mobile browser behaves instead of reading engine source, specs or caniuse, to check UI that depends on native controls, fonts, scrollbars, focus rings, IME or touch, and when the user wants to see a page in another browser or OS. Apply also when configuring credentials or the server, or when it fails to connect.
license: MIT
compatibility:
  - Claude Code
metadata:
  author: dangreen
  tags:
    - mcp
    - browserstack
    - cross-browser
    - safari
    - mobile
---

# BrowserStack MCP

BrowserStack runs real browsers on real macOS, Windows, iOS and Android machines. Two of its products matter here: Live, an interactive session for a human, and Automate, WebDriver sessions a script drives. The MCP server wraps both, plus accessibility scans, Percy and test management. This skill says when to reach for it, what was learned using it, and how to set it up.

## When to use it

- **Before stating how Safari, Firefox, Edge or a mobile browser behaves.** Run it there, at least on the oldest and the newest version that matter. Engine source, specs and caniuse explain a result but are not one: WebKit source once "proved" that Safari drops a read-only date field from the Tab order, and real Safari 16.5 to 27 kept it there.
- **After UI work that depends on the engine or the OS.** Native controls (search, date, datalist), fonts and text metrics, scrollbars, focus rings, IME, touch and the on-screen keyboard all differ outside Chrome.
- **When the user wants to see a page in another browser or OS.** Show screenshots per browser in one gallery, or open a Live session for the user.
- **For an accessibility scan of a page**, with `startAccessibilityScan`. Like Live sessions, it opens the tunnel for localhost URLs itself.

Check in local Chrome first (the `chrome-mcp` skill), it answers in seconds. BrowserStack is for what Chrome cannot tell.

## Live or Automate

- **`runBrowserLiveSession`** opens a Live session and returns a link for a human: the agent never sees that screen. Use it to hand the user a browser. For localhost URLs it starts the BrowserStack Local tunnel itself.
- **Automate from a script** is how the agent checks things itself. A small WebDriver script in the scratchpad opens the page, runs code, measures and saves screenshots, which you then `Read`. `fetchAutomationScreenshots` can return a session's screenshots as images too, but it collects them from the WebDriver `GET /screenshot` calls in the session log, so it works for WebDriver (Selenium) sessions and not for Playwright. `getFailureLogs` returns a session's logs and video URL.

A one-off check needs no client library, W3C WebDriver over `fetch` is enough:

```js
import {
  readFileSync,
  writeFileSync
} from 'node:fs'

const hub = 'https://hub-cloud.browserstack.com/wd/hub'
const auth = `Basic ${Buffer.from(`${process.env.BROWSERSTACK_USERNAME}:${process.env.BROWSERSTACK_ACCESS_KEY}`).toString('base64')}`
const html = readFileSync('probe.html', 'utf8')

async function wd(method, path, body, timeout = 60000) {
  const response = await fetch(hub + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': auth
    },
    body: body && JSON.stringify(body),
    signal: AbortSignal.timeout(timeout)
  })
  const { value } = await response.json().catch(() => ({}))

  if (!response.ok || value?.error) {
    throw new Error(`${method} ${path}: ${JSON.stringify(value)}`)
  }

  return value
}

const { sessionId } = await wd('POST', '/session', {
  capabilities: {
    alwaysMatch: {
      'browserName': 'Safari',
      'browserVersion': '18.4',
      'bstack:options': {
        os: 'OS X',
        osVersion: 'Sequoia',
        projectName: 'my-app',
        buildName: 'tab order probe',
        sessionName: 'Safari 18.4'
      }
    }
  }
}, 600000)

try {
  await wd('POST', `/session/${sessionId}/url`, {
    url: `data:text/html;base64,${Buffer.from(html).toString('base64')}`
  })

  const focused = await wd('POST', `/session/${sessionId}/execute/sync`, {
    script: 'return document.activeElement.id',
    args: []
  })
  const screenshot = await wd('GET', `/session/${sessionId}/screenshot`)

  console.log(focused)
  writeFileSync('safari-18.4.png', Buffer.from(screenshot, 'base64'))
} finally {
  await wd('DELETE', `/session/${sessionId}`)
}
```

### Capabilities

- Take exact browser, OS and device names from `GET https://api.browserstack.com/automate/browsers.json` (same Basic auth) instead of guessing.
- Desktop: `browserName`, `browserVersion` and `'bstack:options': { os, osVersion }`, where `os` is `OS X` or `Windows` and macOS versions go by name (`Sequoia`, `Tahoe`).
- Real mobile: `browserName` (`safari` or `chrome`) and `'bstack:options': { deviceName, osVersion, realMobile: 'true' }`.
- Name every session (`projectName`, `buildName`, `sessionName`) to find it in the dashboard, and log each step with the seconds since the session started to find it in the session video.

### Reaching your page

- **A self-contained page**, such as a probe or a production bundle with its CSS inlined, loads as a `data:text/html;base64,…` URL with no tunnel. iOS Safari ignores `data:` URLs: open `about:blank` and `document.write` the page through `execute/sync`.
- **A dev server or Storybook** needs BrowserStack Local. Start one tunnel per run with the `browserstack-local` package, `new Local().start({ key, localIdentifier, forceLocal: true })`, and put `local: 'true'` with the same `localIdentifier` into `bstack:options`. The server must listen on `127.0.0.1`: Node resolves `localhost` to `::1` alone, the tunnel goes over IPv4, and the browser shows "Unable to display the page". Open `http://bs-local.com:<port>` rather than `localhost`, which Safari needs, and allow that host in the server (Vite `server.allowedHosts`).

### Quirks

- Desktop machines report `devicePixelRatio` 1. For 2 in Chrome or Edge, emulate it over CDP: `POST /session/{id}/goog/cdp/execute` (`ms/cdp/execute` in Edge) with `Emulation.setDeviceMetricsOverride`.
- iOS Safari has no element screenshots, and its screenshot is the whole device screen: inject a marker of known size and crop by it. Android Chrome has element screenshots.
- Safari on BrowserStack's macOS has "Press Tab to highlight each item" on, so Tab reaches every control.
- An element inside a shadow root is screenshotted from the root: `findElement(host).getShadowRoot().findElement(selector).takeScreenshot()` in Selenium.
- There are no Linux desktops.

### Hygiene

- Credentials come only from the environment. Never print, echo or log them, and mask output that might contain them: `sed "s/$BROWSERSTACK_ACCESS_KEY/***/g"`.
- The plan limits parallel sessions, and other agents and people share them. Run at most 3 at once, `DELETE` every session in a `finally`, and check at the end that `GET https://api.browserstack.com/automate/plan.json` shows none running.
- A session can take minutes to start when machines are busy. Give `POST /session` a long timeout and every other command a short one, so a stuck browser fails the run instead of hanging it.
- Scripts, results and screenshots stay in the scratchpad, never in the repo. Show the user a gallery: one page with a frame per browser and OS.

## Setup

### Credentials

Find the username and access key in BrowserStack: Account → Settings, the Automate section. Put them into `~/.zshenv`, which every shell reads, including the ones Claude Code starts. Do not paste the key into the chat: it would stay in the transcript.

```sh
export BROWSERSTACK_USERNAME=<username>
export BROWSERSTACK_ACCESS_KEY=<access key>
```

### Server

Add the server from a shell that already has the variables, such as a new terminal. A shell that has not read `~/.zshenv` yet writes empty strings into the config.

```sh
claude mcp add browserstack --scope user \
  -e BROWSERSTACK_USERNAME="$BROWSERSTACK_USERNAME" \
  -e BROWSERSTACK_ACCESS_KEY="$BROWSERSTACK_ACCESS_KEY" \
  -- npx -y @browserstack/mcp-server@latest
```

The server needs Node.js 20.9 or newer. App tools (`runAppLiveSession`, `takeAppScreenshot`, `runAppTestsOnBrowserStack`) also need `MCP_UPLOAD_BASE_DIR`, the directory that holds the `.ipa` or `.apk`, and Percy tools need a Percy token.

### Check

Check the config without printing the key: both values must be set, and `claude mcp list` must show `browserstack: … ✔ Connected`.

```sh
node -e '
const { env } = require(`${process.env.HOME}/.claude.json`).mcpServers.browserstack
for (const [name, value] of Object.entries(env)) console.log(name, value ? `set, ${value.length} chars` : "EMPTY")
'
claude mcp list
```

Servers start with the session: restart it or reconnect the server in `/mcp`.

### When it fails

**`Connection closed` at session start.** Run the server by hand to see the error. `Cannot find package '…/_npx/<hash>/node_modules/readable-stream/index.js'` means an `npx` install was cut off by the startup timeout and left a broken cache, which fails with any keys. Delete that `~/.npm/_npx/<hash>` and warm the cache by starting the server by hand with an `initialize` request, then reconnect in `/mcp`. The answer names `BrowserStack MCP Server`.

```sh
(echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"probe","version":"0"}}}'; sleep 15) \
  | timeout 240 npx -y @browserstack/mcp-server@latest
```

**Empty values in the config.** Add the server again, as above, from a shell that has the variables.
