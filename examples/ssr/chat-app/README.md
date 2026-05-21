# Chat App Example

A small declarative FAST chat demo that pre-renders its initial markup with `@microsoft/fast-build` and streams canned assistant replies with a hidden iframe plus `document.write()`.

## Design system

This example consumes the shared `@microsoft/fast-examples-design-system`
workspace package. The design-system package is **CSS-only** — `src/main.ts`
imports `@microsoft/fast-examples-design-system/tokens.css` once, and
`public/styles.css` references the registered `--fast-*` tokens through
`var(...)`.

The app uses the **dark** theme statically. `<html data-theme="dark">` is set
in [`entry.html`](./entry.html), so the FAST build step carries that attribute
into the generated `index.html`. The example does not implement a runtime
theme toggle.

For the shared package overview, the token catalog, and authoring rules, see
[`../../design-system/README.md`](../../design-system/README.md) and
[`../../design-system/DESIGN.md`](../../design-system/DESIGN.md).

## What it demonstrates

- declarative FAST custom elements via `declarativeTemplate()`
- initial markup rendered from `entry.html` + `templates.html`
- chunked assistant response streaming with the Jake Archibald iframe technique
- mixed native HTML and FAST custom elements in each canned reply
- exact-match canned prompts with a fallback response

## Suggested prompts

Use these exact prompts to walk through the conversation:

- `Hi`
- `How are you?`
- `What's the weather like?`
- `Tell me a joke`
- `What can you do?`
- `Goodbye`

## Run locally

From the repository root:

```bash
npm run build -w @microsoft/fast-chat-app-example
npm run start -w @microsoft/fast-chat-app-example
```

Or from this folder:

```bash
npm run build
npm start
```

The build first regenerates `index.html` from `entry.html`, `state.json`, and `templates.html`, then runs TypeScript and Vite.

## Files

- `entry.html` — source document for the FAST build step
- `state.json` — initial state used while pre-rendering the page shell
- `templates.html` — declarative FAST templates for the custom elements
- `build-markup.mjs` — runs `@microsoft/fast-build` and injects the templates into `index.html`
- `public/styles.css` — token-based shared stylesheet for the page shell and component shadow roots
- `src/` — runtime classes, canned conversation data, and hydration bootstrap
- `index.html` — generated pre-rendered page used by Vite

See [DESIGN.md](./DESIGN.md) for architecture details, design-system notes, and the canned conversation data.
