# Chat App Example

A small declarative FAST chat demo that pre-renders its initial markup with `@microsoft/fast-build` and streams canned assistant replies with a hidden iframe plus `document.write()`.

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
- `src/` — runtime classes, canned conversation data, and hydration bootstrap
- `index.html` — generated pre-rendered page used by Vite

See [DESIGN.md](./DESIGN.md) for architecture details and the canned conversation data.
